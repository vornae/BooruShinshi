import { FileTags, PaginationInfo, ParsedImageInfo, supported_hostname_t } from "../common";

export abstract class AbstractModule {
    public abstract hostname(): supported_hostname_t
    public abstract fullName(): string
    public abstract abbrev(): string
    public abstract containsHentai(): boolean
    public abstract inPostListPage(): boolean
    public abstract inPostContentPage(): boolean
    /** return tag list (usually from GET params) if available (usually in post list page) */
    public abstract getCurrentQueryList(): string[]
    /** generate URL toward post list page. */
    public abstract makeQueryUrl(queryList: string[]): string
    /** for making all images links in post list page or post content page always be opened with new tab. */
    public abstract getLinkElementsToPost(): HTMLAnchorElement[] | NodeListOf<HTMLAnchorElement>
    /** In post content page, do not parse page + insert floating buttons until
     * every elements are non-null.
     *
     * That's to say, when in a post content page, it will wait for all "pending
     * elements" are ready, them start to parse page + insert floating buttons.
     */
    public abstract ifPostContentPageIsReady(): boolean
    /** After the pending elements ready, then call getPaginationInfo. */
    public abstract ifPostLinkPageIsReady(): boolean
    public abstract getPostId(): number
    public abstract collectImageInfoList(): ParsedImageInfo[]
    /** Remember to `str.trim().replaceAll(' ', '_')` */
    public abstract collectTags(): FileTags
    public abstract getPaginationInfo(): PaginationInfo
    /** content.ts will call this after <body> is ready. */
    public abstract onBodyReady(): void
}

