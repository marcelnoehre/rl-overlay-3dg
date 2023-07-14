import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	seriesChange$: ReplaySubject<number> = new ReplaySubject();
	seriesInfoChange$: ReplaySubject<string> = new ReplaySubject();

	public setLocalEntry(key: string, data: unknown): void {
		localStorage.setItem(key, JSON.stringify(data));
		if(key === 'series-length') this.seriesChange$.next(Number(data));
		if(key === 'series-info') this.seriesInfoChange$.next(String(data));
	}

	public getLocalEntry(key: string): any {
		return JSON.parse(localStorage.getItem(key)!);
	}

	public clearLocal(): void {
		localStorage.clear();
	}
}