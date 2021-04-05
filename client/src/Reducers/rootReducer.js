import types from './types'

const rootReducer = (state, action) => {
    // console.log("reducer called with")
    // console.log(state)
    // console.log(action)
    var newState = null;

    switch (action.type) {
        case types.UPDATE_ACCOUNTS:
            console.log("reducer updating accounts with :")
            console.log(action.value)
            newState = {...state, accounts: action.value}
            break;
            // return ({...state, accounts: action.value})

            // return state
        //     console.log("UPDATING ACCOUNTS")
        case types.UPDATE_WEB3:
            console.log("reducer updating web3 with object: ")
            console.log(action.value)
            newState = {...state, web3: action.value}
            break;

            // return ({...state, web3: action.value})
            
            // return {...state, web3: action.value}

            // action.value.eth.getAccounts()
            // .then((accounts) => {
            //     console.log("reducer updating accounts and web3")
            //     console.log({...state, web3: action.value, accounts:accounts})
            //     return {...state, web3: action.value, accounts:accounts}
            // })
            // .catch((e) => {
            //     console.log("Error: " + e)
            // })
            

        default: 
            console.log("reducer didn't update state, defaulting")
            // return state
    }
    console.log("returning new state")
    console.log(newState)
    return newState;
}

export default rootReducer;