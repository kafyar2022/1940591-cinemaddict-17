import AbstractView from '../framework/view/abstract-view.js';

export default class CommentsLoadingView extends AbstractView {
  get template() {
    return `<section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Loading...</h3>
            </section>`;
  }
}
