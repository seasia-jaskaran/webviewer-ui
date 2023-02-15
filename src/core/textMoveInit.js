import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#textSearchInit__anchor
 */
export default (moveValue, moveMode, isFullMove, handleMoveResult, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).textMoveInit(moveValue, moveMode, isFullMove, handleMoveResult);
};
