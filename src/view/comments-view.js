import he from 'he';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createCommentTemplate = ({ id, author, comment, date, emotion }) => `
  <li class="film-details__comment">
      ${emotion ? `<span class="film-details__comment-emoji"><img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}"></span>` : '<span class="film-details__comment-emoji film-details__comment-emoji--empty"></span>'}
    <div>
      <p class="film-details__comment-text">${he.encode(comment) ?? ''}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author ?? ''}</span>
        <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
        <button class="film-details__comment-delete" data-id="${id}">Delete</button>
      </p>
    </div>
  </li>
`;

const createEmojiTemplate = (emoji) => `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`;

const createCommentsTemplate = ({ comments, newComment }) => `
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

    <ul class="film-details__comments-list">

      ${comments.map((comment) => createCommentTemplate(comment)).join('')}

    </ul>

    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${newComment.emotion ? createEmojiTemplate(newComment.emotion) : ''}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment.comment ?? ''}</textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${newComment.emoji === 'smile' ? 'checked' : ''}>
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${newComment.emoji === 'sleeping' ? 'checked' : ''}>
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${newComment.emoji === 'puke' ? 'checked' : ''}>
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${newComment.emoji === 'angry' ? 'checked' : ''}>
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  </section>
`;

export default class CommentsView extends AbstractStatefulView {
  constructor(comments) {
    super();
    this._state = CommentsView.parseCommentsToState(comments);
    this.#setInnerHandlers();
  }

  get template() {
    return createCommentsTemplate(this._state);
  }

  setFormSubmitHandler = (cb) => {
    this._callback.formSubmit = cb;

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#formSubmitHandler);
  };

  setDeleteBtnClickHandler = (cb) => {
    this._callback.deleteComment = cb;

    this.element.addEventListener('click', this.#deleteBtnClickHandler);
  };

  static parseCommentsToState = (comments) => ({
    'comments': [...comments],
    'newComment': {
      comment: null,
      emotion: null,
    },
  });

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteBtnClickHandler(this._callback.deleteComment);
  };

  #formSubmitHandler = (evt) => {
    if (evt.ctrlKey && evt.keyCode === 13) {
      this._callback.formSubmit(this._state.newComment);
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__new-comment')
      .addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#textInputHandler);
  };

  #emojiClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        'newComment': { ...this._state.newComment, emotion: evt.target.value },
      });
    }
  };

  #textInputHandler = (evt) => (this._state.newComment.comment = evt.target.value);

  #deleteBtnClickHandler = (evt) => {
    if (evt.target.className === 'film-details__comment-delete') {
      evt.preventDefault();

      this._callback.deleteComment(evt);
    }
  };
}
