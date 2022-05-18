import AbstractView from '../framework/view/abstract-view.js';

export default class FilmsWrapView extends AbstractView {
  get template() {
    return '<section classs="films"></section>';
  }
}
