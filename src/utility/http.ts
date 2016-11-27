export interface AJAXResponse {
    responseText?: string;
}

export class Http {
    public async: boolean = false;

    constructor(async: boolean) {
        if (async) {
            this.async = async;
        }
    }

    public get(url: string, callback: Function): void {
        let xhr: XMLHttpRequest = this.createXHR();

        if (xhr) {
            xhr.open('GET', url, this.async);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(xhr);
                }
            };
            xhr.send(null);
        }
    }

    private createXHR(): XMLHttpRequest {
        try { return new XMLHttpRequest(); } catch (err) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (err) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (err) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (err) {}
        try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (err) {}

        return null;
    }
}
