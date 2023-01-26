import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingImageMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { ImageMessage, IncomingMessagePayload } from "@app/model/convs-mgr/conversations/messages";
import { ImagePayload, MessageTypes } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingImageParser extends IncomingImageMessageParser {

  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools) 
  {
    super(activeChannel, msgService$, tools);
  }

  parse(incomingMessage: IncomingMessagePayload): ImageMessage {
    const incomingImageMessage =  incomingMessage as ImagePayload;

    // Create the base message object
    const standardMessage: ImageMessage = {
      id: incomingImageMessage.id,
      type: MessageTypes.IMAGE,
      endUserPhoneNumber: incomingImageMessage.from,
      mediaId: incomingImageMessage.id,
      payload: incomingImageMessage,
      mime_type: incomingImageMessage.mime_type,
    };


    return standardMessage;
  }

  save(message: ImageMessage, endUserId: string) {
    return this.saveFileMessage(message, endUserId);
  }
}