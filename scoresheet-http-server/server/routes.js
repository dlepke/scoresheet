const express = require('express');
const router = express.Router();
const data = require('./data.json');
const queries = require('../queries');

// API request for all templates data (homepage)
router.get('/', (req, res) => {
	res.status(200).json(data);
});

router.get('/templates', (req, res) => {
	// res.status(200).json(data);
	queries.getTemplates().then((templates) => {
		res.status(200).json(templates);
	});
});

//save fields to database associated with game_id
router.get('/games/:id', (req, res) => {
	const gameId = req.params.id;

	queries.getGameTemplate(gameId).then((template) => {
		const templateId = template[0].template_id;
		queries.getFields(templateId).then((fields) => {
			const activeFields = fields.filter((field) => field.name !== 'Total');
			queries.getTemplateInfo(templateId).then(([ templateInfo ]) => {
				queries.getTemplateRelationshipsPieces(templateId).then((pieces) => {
					queries.getTemplateRelationshipsOperations(templateId).then((operations) => {
						res.status(200).json({
							fields: activeFields,
							templateInfo,
							pieces,
							operations
						});
					});
				});
			});
		});
	});
});

// take create-template data and write it into the database as a new template
router.post('/templates/new', (req, res) => {
	templateRules = req.body.templateRules;
	templateFields = req.body.templateColumns;
	templateNote = req.body.templateNote;
	templateName = req.body.templateName;
	queries.createNewTemplateInstance(templateName, templateNote).then((templateId) => {
		templateId = templateId[0].id;
		let arrayOfFields = [];
		let arrayOfFieldIndicies = [];
		templateFields.forEach(function(field) {
			queries.createTemplateField(field, templateId).then((arrFields) => {
				arrayOfFields.push(arrFields[0].name);
				arrayOfFieldIndicies.push(arrFields[0].id);
			});
		}, this);
		templateRules.forEach(function(rule) {
			queries.createNewRelationshipInstance(templateId).then((relationshipId) => {
				queries.createNewPieceRelationshipInstance(relationshipId[0].id, rule.value).then((IPRId) => {
					rule.pieces.forEach(function(piece) {
						const indexMatch = findIndexMatch(piece.piece, arrayOfFields);
						const fieldId = arrayOfFieldIndicies[indexMatch];
						queries
							.createNewPieceInstance(IPRId[0].id, fieldId, piece.equality, piece.number)
							.then((arr) => {
								console.log('completed piece', arr[0].id);
							});
					}, this);
					if (rule.additional_operations.length !== 0) {
						rule.additional_operations.forEach(function(operation) {
							const indexMatch = findIndexMatch(operation.piece, arrayOfFields);
							const fieldId = arrayOfFieldIndicies[indexMatch];
							queries
								.createNewOperationInstance(IPRId[0].id, fieldId, operation.operation, operation.number)
								.then((arr) => {});
						}, this);
					}
				});
			});
		}, this);
	});
});

// create new game with a template id passed in and pass back a generated game_id
// reroutes you to get game for that game_id
router.post('/games/new', (req, res) => {
	const templateId = req.body.templateID;

	queries.allTemplateOperations(templateId).then((operations) => {
		if (operations.length !== 0) {
			queries.getFields(templateId).then((fields) => {
				const activeFields = fields.filter((field) => field.name !== 'Total');
				queries.getTemplateInfo(templateId).then(([ templateInfo ]) => {
					queries.getTemplateRelationshipsPieces(templateId).then((pieces) => {
						queries.getTemplateRelationshipsOperations(templateId).then((operations) => {
							queries.createNewGameInstance(templateId).then(([ game ]) => {
								res.status(200).json({
									fields: activeFields,
									templateInfo,
									pieces,
									operations,
									game
								});
							});
						});
					});
				});
			});
		} else {
			queries.getFields(templateId).then((fields) => {
				const activeFields = fields.filter((field) => field.name !== 'Total');
				queries.getTemplateInfo(templateId).then(([ templateInfo ]) => {
					queries.getTemplateRelationshipsPieces(templateId).then((pieces) => {
						queries.createNewGameInstance(templateId).then(([ game ]) => {
							res.status(200).json({
								fields: activeFields,
								templateInfo,
								pieces,
								operations: [],
								game
							});
						});
					});
				});
			});
		}
	});
});

module.exports = router;

function findIndexMatch(name, arrNames) {
	for (var i = 0; i < arrNames.length; i++) {
		if (arrNames[i] === name) {
			return i;
		}
	}
}
