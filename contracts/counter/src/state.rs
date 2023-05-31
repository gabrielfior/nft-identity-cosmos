use std::ops::Add;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::models::CallerRecipient;
use cosmwasm_std::Addr;
use cw_storage_plus::Item;


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct State {
    pub owner: Addr,
    pub callerRecipient: Vec<(String, String)>,
}

pub const STATE: Item<State> = Item::new("state");
