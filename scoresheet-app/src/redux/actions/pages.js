import { CHANGE_PAGE, CHANGE_GAME_ID, CHANGE_TEMPLATE_NAME} from '../constants/pages';

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    page
  };
}

export function changeGameID(gameid) {
  return {
    type: CHANGE_GAME_ID,
    gameid
  }
}

export function changeTemplateName(templateName) {
  return {
    type: CHANGE_TEMPLATE_NAME,
    templateName
  };
}
