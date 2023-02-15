let moveListeners = [];
let overrideMoveExecutionFn;

export function addMoveListener(moveListener) {
  moveListeners.push(moveListener);
}

export function removeMoveListener(moveListener) {
  moveListeners = moveListeners.filter((listener) => {
    return listener !== moveListener;
  });
}

export function getMoveListeners() {
  return [...moveListeners];
}

export function clearMoveListeners() {
  moveListeners = [];
}

export function overrideMoveExecution(fn) {
  overrideMoveExecutionFn = fn;
}

export function getOverrideMoveExecution() {
  return overrideMoveExecutionFn;
}
