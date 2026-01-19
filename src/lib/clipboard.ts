import { createClientOnlyFn } from "@tanstack/react-start";


export const clipboardHander=createClientOnlyFn(async (url:string)=>{
    await navigator.clipboard.writeText(url);
    return ;
})