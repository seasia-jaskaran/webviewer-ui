import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getPageSearchResults__anchor
 */
export default function getPageMoveResults(pageNumber, documentViewerKey = 1) {
  return core.getDocumentViewer(documentViewerKey).getPageMoveResults(pageNumber);
}
