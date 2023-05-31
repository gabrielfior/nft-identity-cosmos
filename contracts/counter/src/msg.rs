use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr};
use crate::models::CallerRecipient;

#[cw_serde]
pub struct InstantiateMsg {
}

#[cw_serde]
pub enum ExecuteMsg {
    AddRecipientToQueue { caller: String, recipient: String }, // [1] add this enum variant,
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(GetCallerRecipientResponse)]
    GetCallerRecipient {},
}


// We define a custom struct for each query response
#[cw_serde]
pub struct GetCallerRecipientResponse {
    pub callerRecipient: Vec<(String,String)>,
}
