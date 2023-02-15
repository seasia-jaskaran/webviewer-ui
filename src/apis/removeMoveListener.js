/**
 * Removes the search listener function.
 * @method UI.removeSearchListener
 * @param {UI.searchListener} listener Search listener function that was added.
 * @example
WebViewer(...)
  .then(function(instance) {
    function searchListener(searchValue, options, results) {
      console.log(searchValue, options, results);
    };

    instance.UI.addSearchListener(searchListener);
    instance.UI.removeSearchListener(searchListener);
  });
 */

  import { removeMoveListener as removeMoveListenerHelper } from 'helpers/move';

  export default function removeMoveListener(listener) {
    removeMoveListenerHelper(listener);
  }
  