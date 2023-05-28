use std::ops::Add;

use cw_storage_plus::Item;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct CallerRecipient {
    /// Account that can transfer/send the token
    pub caller: String,
    /// When the Approval expires (maybe Expiration::never)
    pub recipient: String,
}
