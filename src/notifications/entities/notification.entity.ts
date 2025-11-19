import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type NotificationDocument = Notification & Document
@Schema({timestamps:true})
export class Notification {
    @Prop({required:true})
    userId:number;

    @Prop({required:true})
    message:string;

    @Prop({default:false})
    read:boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
