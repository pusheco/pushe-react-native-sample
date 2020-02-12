import {useReducer} from "react";

export const ACTIONS = {
    'SHOW_DIALOG': 'show_dialog',
    'HIDE_DIALOG': 'hide_dialog',
    'APPEND_LOG': 'append_log'

};

const initState = {
    dialogVisiblity: false,
    dialolgData:{
        title:'',
        message: '',
        button1Action:()=>{},
        button2Action:()=>{},
        button1Title:'Ok',
        button2Title:'Cancel',
    },
    log :'Click an action to test it'
};

export function useAppState() {

    function reducer(state, action) {
        switch (action.type) {
          case ACTIONS.SHOW_DIALOG:
            return {
                ...state,
                dialogVisiblity: true,
                dialolgData: {...action.payload}
            };
          case ACTIONS.HIDE_DIALOG:
            return {
                ...state,
                dialogVisiblity: false,
                log: action.log

            };
          case ACTIONS.APPEND_LOG:
              return {
                  ...state,
                  log: action.log
              }
         
          default:
            return state;
        }
    }

    const [state, updateAppState] = useReducer(reducer, initState);

    return [state, updateAppState];
}