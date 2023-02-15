import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#displayAdditionalSearchResult__anchor
 */
export default (result, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).displayAdditionalMoveResult(result);
};
