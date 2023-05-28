use std::ops::Add;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::models::CallerRecipient;
use cosmwasm_std::Addr;
use cw_storage_plus::Item;

// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
// pub struct CallerRecipient {
//     /// Account that can transfer/send the token
//     pub caller: String,
//     /// When the Approval expires (maybe Expiration::never)
//     pub recipient: Addr,
// }

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct State {
    pub count: i32,
    pub owner: Addr,
    pub callerRecipient: Vec<(String, String)>,
}

pub const STATE: Item<State> = Item::new("state");
