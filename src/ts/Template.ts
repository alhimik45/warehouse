export abstract class Template {
    private _template: HandlebarsTemplateDelegate;

    constructor(id: string) {
        this._template = Handlebars.compile($(id).html());
    }

    public getHtml(obj: object): string{
        return this._template(obj);
    }
}