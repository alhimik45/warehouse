import {Template} from "./Template";
import {ListElementTemplate} from "./ListElementTemplate";
import {MessagesTemplate} from "./MessagesTemplate";
import {ProtectorTemplate} from "./ProtectorTemplate";
import {CellTemplate} from "./CellTemplate";
import {InfoTemplate} from "./InfoTemplate";

export class TemplateFactory {
    private static dict: Map<string, Template> = new Map();

    public static getTemplate(name: string): Template {
        debugger;
        if (TemplateFactory.dict.has(name)) {
            return TemplateFactory.dict.get(name);
        }
        let o :Template;
        switch (name) {
            case "resource-list":
                o = new ListElementTemplate("#resource-template");
                break;
            case "protector-list":
                o = new ListElementTemplate("#protector-template");
                break;
            case "bad-factor-list":
                o = new ListElementTemplate("#bad-factor-template");
                break;
            case "messages":
                o = new MessagesTemplate();
                break;
            case "protector":
                o = new ProtectorTemplate();
                break;
            case "cell":
                o = new CellTemplate();
                break;
            case "info":
                o = new InfoTemplate();
                break;
        }
        TemplateFactory.dict.set(name, o);
        return o;
    }
}