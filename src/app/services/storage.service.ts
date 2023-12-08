import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	public setLocalEntry(key: string, data: any): void {
		localStorage.setItem(key, JSON.stringify(data));
	}

	public getLocalEntry(key: string): any {
		return JSON.parse(localStorage.getItem(key)!);
	}

	public deleteLocalEntry(key: string): void {
		localStorage.removeItem(key);
	}

	public clearLocal(): void {
		localStorage.clear();
	}
}