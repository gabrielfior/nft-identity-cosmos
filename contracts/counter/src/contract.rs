#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};
use crate::models::CallerRecipient;
use cosmwasm_std::Empty;


// version info for migration info
const CONTRACT_NAME: &str = "crates.io:counter";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        callerRecipient: Vec::with_capacity(10),
        owner: info.sender.clone(),
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::AddRecipientToQueue { caller, recipient} => execute::add_caller_recipient(deps, caller, recipient),
    }
}

pub mod execute {
    use std::ops::Add;
    use cosmwasm_std::Addr;
    use super::*;

    pub fn add_caller_recipient(deps: DepsMut, caller: String, recipient: String) -> Result<Response, ContractError> {
        STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
            // ToDo - Make struct instead of simple strings
            state.callerRecipient.push((caller, recipient.to_string()));
            Ok(state)
        })?;

        Ok(Response::new().add_attribute("method", "add_caller_recipient"))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCallerRecipient {} => to_binary(&query::getCallerRecipient(deps)?),
    }
}

pub mod query {
    use crate::msg::GetCallerRecipientResponse;
    use super::*;

    pub fn getCallerRecipient(deps: Deps) -> StdResult<GetCallerRecipientResponse> {
        let state = STATE.load(deps.storage)?;
        Ok(GetCallerRecipientResponse { callerRecipient: state.callerRecipient })
    }
}
