use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Addr;
use crate::models::CallerRecipient;

#[cw_serde]
pub struct InstantiateMsg {
    pub count: i32,
}

#[cw_serde]
pub enum ExecuteMsg {
    Increment {},
    Reset { count: i32 },
    AddRecipientToQueue { caller: String, recipient: String }, // [1] add this enum variant,
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    #[returns(GetCountResponse)]
    GetCount {},
    #[returns(GetCallerRecipientResponse)]
    GetCallerRecipient {},
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetCountResponse {
    pub count: i32,
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetCallerRecipientResponse {
    pub callerRecipient: Vec<(String,String)>,
}
