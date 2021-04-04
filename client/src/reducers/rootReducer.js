import types from './types'

const rootReducer = (state, action) => {
    console.log("reducer called with")
    console.log(state)
    console.log(action)
    switch (action.type) {
        case types.UPDATE_ACCOUNTS:
            return {...state, accounts: action.value}
        case types.UPDATE_WEB3:
            console.log("reducer returning state: ")
            console.log({...state, web3: action.value})
            return {...state, web3: action.value}
        default: 
            return state
    }
}

export default rootReducer;
