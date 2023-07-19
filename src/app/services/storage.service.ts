import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Team } from "../interfaces/team";
import { Storage } from "../enums/storage";

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	directorChange$: ReplaySubject<boolean> = new ReplaySubject();
	teamsChange$: ReplaySubject<Team[]> = new ReplaySubject();
	seriesChange$: ReplaySubject<number> = new ReplaySubject();
	seriesInfoChange$: ReplaySubject<string> = new ReplaySubject();

	public setLocalEntry(key: string, data: any): void {
		localStorage.setItem(key, JSON.stringify(data));
		if(key === Storage.DIRECTOR) this.directorChange$.next(data);
		if(key === Storage.TEAMS) this.teamsChange$.next(data)
		if(key === Storage.SERIES_LENGTH) this.seriesChange$.next(Number(data));
		if(key === Storage.SERIES_INFO) this.seriesInfoChange$.next(String(data));
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