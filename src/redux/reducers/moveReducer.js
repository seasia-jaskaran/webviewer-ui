export default (initialState) => (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'MOVE_TEXT': {
            const { moveValue, replaceValue, options = {} } = payload;
            const { caseSensitive, wholeWord, wildcard, regex, moveUp, ambientString } = options;
            return {
                ...state,
                value: moveValue,
                replaceValue: replaceValue,
                nextResult: null,
                nextResultIndex: null,
                isCaseSensitive: caseSensitive || false,
                isWholeWord: wholeWord || false,
                isWildcard: wildcard || false,
                isRegex: regex || false,
                isMoveUp: moveUp || false,
                isAmbientString: ambientString || false,
            };
        }
        case 'MOVE_TEXT_FULL': {
            const { moveValue, options = {} } = payload;
            const { caseSensitive, wholeWord, wildcard, regex } = options;
            return {
                ...state,
                value: moveValue,
                isCaseSensitive: caseSensitive || false,
                isWholeWord: wholeWord || false,
                isWildcard: wildcard || false,
                isRegex: regex || false,
                isMoveUp: false,
                isAmbientString: true,
            };
        }
        case 'SET_MOVE_VALUE': {
            return {
                ...state,
                value: payload.value,
                nextResult: null,
                nextResultIndex: null,
            };
        }
        case 'SET_MOVE_VALUE': {
            return {
                ...state,
                replaceValue: payload.replaceText,
            };
        }
        case 'SET_NEXT_RESULT': {
            return {
                ...state,
                nextResult: payload.nextResult,
                nextResultIndex: payload.nextResultIndex,
            };
        }
        case 'ADD_RESULT': {
            return {
                ...state,
                results: [...state.results, payload.result],
            };
        }
        case 'SET_CASE_SENSITIVE': {
            return {
                ...state,
                isCaseSensitive: payload.isCaseSensitive,
                nextResult: null,
                nextResultIndex: null,
            };
        }
        case 'SET_WHOLE_WORD': {
            return {
                ...state,
                isWholeWord: payload.isWholeWord,
                nextResult: null,
                nextResultIndex: null,
            };
        }
        case 'SET_WILD_CARD': {
            return {
                ...state,
                isWildcard: payload.isWildcard,
                nextResult: null,
                nextResultIndex: null,
            };
        }
        case 'SET_MOVE_ERROR': {
            return {
                ...state,
                errorMessage: payload.errorMessage,
            };
        }
        case 'RESET_MOVE': {
            return {
                ...initialState,
                value: state.value,
                isCaseSensitive: state.isCaseSensitive,
                isWholeWord: state.isWholeWord,
                isWildcard: state.isWildcard,
                nextResult: null,
                nextResultIndex: null,
            };
        }
        case 'SET_MOVE_RESULTS': {
            return {
                ...state,
                results: payload,
            };
        }
        case 'SET_CLEAR_MOVE_ON_PANEL_CLOSE': {
            return {
                ...state,
                clearMovePanelOnClose: payload,
            };
        }
        case 'SET_PROCESSING_MOVE_RESULTS': {
            return {
                ...state,
                isProcessingMoveResults: payload.isProcessingMoveResults,
            };
        }
        case 'REPLACE_REDACTION_MOVE_PATTERN': {
            return {
                ...state,
                redactionMovePatterns: {
                    ...state.redactionMovePatterns,
                    [payload.movePattern]: {
                        ...state.redactionMovePatterns[payload.movePattern],
                        regex: payload.regex,
                    }
                }
            };
        }
        case 'ADD_REDACTION_MOVE_PATTERN': {
            return {
                ...state,
                redactionMovePatterns: {
                    ...state.redactionMovePatterns,
                    [payload.movePattern.type]: payload.movePattern,
                }
            };
        }
        case 'REMOVE_REDACTION_MOVE_PATTERN': {
            const updatedRedactionMovePatterns = { ...state.redactionMovePatterns };
            delete updatedRedactionMovePatterns[payload.movePatternType];
            return {
                ...state,
                redactionMovePatterns: updatedRedactionMovePatterns,
            };
        }
        default:
            return state;
    }
};
