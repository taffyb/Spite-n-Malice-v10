import { Observable } from "rxjs";
import { AngularPageVisibilityStateEnum } from "./angular-page-visibility.state.enum";
export declare class AngularPageVisibilityService {
    private onPageVisibleSource;
    private onPageHiddenSource;
    private onPagePrerenderSource;
    private onPageUnloadedSource;
    private onPageVisibilityChangeSource;
    private hidden;
    private visibilityChange;
    private visibilityState;
    private document;
    $onPageVisible: Observable<void>;
    $onPageHidden: Observable<void>;
    $onPagePrerender: Observable<void>;
    $onPageUnloaded: Observable<void>;
    $onPageVisibilityChange: Observable<AngularPageVisibilityStateEnum>;
    constructor();
    isPageVisible(): boolean;
    isPageHidden(): boolean;
    isPagePrerender(): boolean;
    isPageUnloaded(): boolean;
    private isHidden;
    private getVisibilityState;
    private defineBrowserSupport;
    private addEventListenerVibilityChange;
}
