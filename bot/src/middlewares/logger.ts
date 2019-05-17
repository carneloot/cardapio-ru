import { ContextMessageUpdate } from "telegraf";

export async function logger(ctx: ContextMessageUpdate, next: () => any) {
    const msgInfo = ctx.update.message;

    console.log(`[Log] ${msgInfo.from.username}: "${msgInfo.text}"`);

    next();
}