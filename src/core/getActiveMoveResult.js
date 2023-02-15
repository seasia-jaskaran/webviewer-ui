import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getActiveSearchResult__anchor
 */
export default function getActiveMoveResult(documentViewerKey = 1) {
  return core.getDocumentViewer(documentViewerKey).getActiveMoveResult();
}
