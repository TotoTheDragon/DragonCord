import { Snowflake } from "../../util/Constants";

export interface ApplicationCommandInteractionData {
    id: Snowflake;
    name: string;
    resolved?: any;
    options?: any[];
    custom_id?: string;
    component_type?: number;
}