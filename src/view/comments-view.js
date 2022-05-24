import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createCommentTemplate = (comment) => `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dayjs(comment.date).format('YYYY/MM/DD HH:mm')}</span>
        <button class="film-details__comment-delete">Delete</button>
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
      <div class="film-details__add-emoji-label">${newComment.emoji ? createEmojiTemplate(newComment.emoji) : ''}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment.text ?? ''}</textarea>
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

  static parseCommentsToState = (comments) => ({
    'comments': [...comments],
    newComment: {
      emoji: null,
      text: null,
    },
  });

  _restoreHandlers = () => {
    this.#setInnerHandlers();
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
        newComment: { ...this._state.newComment, emoji: evt.target.value },
      });
    }
  };

  #textInputHandler = (evt) => (this._state.newComment.text = evt.target.value);
}
