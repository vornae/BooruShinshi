import { AbstractModule } from "./abstract"
import { ALL_TAG_CATEGORY, COMMON_TAG_SELECTOR, FileTags, FileTagsElementClass, generalCollectImageInfoList, makeEmptyFileTags, ParsedImageInfo, supported_hostname_t, Tag } from "../common"


export class ModuleAllthefallenMoe extends AbstractModule {
    constructor() {
        super()
    }
    hostname(): supported_hostname_t {
        return 'booru.allthefallen.moe'
    }
    fullName (): string {
        return 'AllTheFallen Booru'
    }
    abbrev (): string {
        return 'ATF'
    }
    inPostListPage(): boolean {
        const params = new URLSearchParams(location.search)
        return !!location.pathname.match(/^[/]posts[/]?$/) &&
            !!params.get('tags')
    }
    inPostContentPage(): boolean {
        return !!location.pathname.match(/\/posts\/\d+/)
    }
    getCurrentQueryList(): string[] {
        const params = new URLSearchParams(location.search)
        const raw = params.get('tags')
        if (raw) { return raw.split(' ') }
        return []
    }
    makeQueryUrl(queryList: string[]): string {
        const fmtted = queryList.filter(x => x).map(x=>x.trim()).join(' ')
        return `https://booru.allthefallen.moe/posts?tags=${fmtted}`
    }
    getPostLinkElementSelector(): string {
        return '#posts-container a'
    }
    getPostContentPagePendingElements(): Array<Element | null> {
        return [
            document.querySelector('#image'),
            document.querySelector('#tag-list'),
            document.querySelector('#post-information'),
            document.querySelector('#post-options'),
        ]
    }
    getPostId(): number {
        const u = new URL(location.href)
        const m = location.pathname.match(/\/posts\/([0-9]+)/)
        return m ? ~~m[1] : -1
    }
    collectImageInfoList(): ParsedImageInfo[] {
        const fin: ParsedImageInfo[] = generalCollectImageInfoList()
        const sizeEl = document.querySelector('#post-info-size')!
        const sizeStr = sizeEl.textContent!.match(/([0-9.]+ *[KMG]B)/)![1]
        const a = sizeEl.querySelector('a')!
        fin.push({ btnText: `High (${sizeStr})`, imgUrl: a.href })
        return fin
    }
    collectTags(): FileTags {
        const sidebarEl = document.querySelector('#tag-list')
        const fileTags: FileTags = makeEmptyFileTags()
        if (!sidebarEl) {
            console.error('[To Developer] Not found tag')
            return fileTags
        }
        const meta: FileTagsElementClass = {
            artist: '.tag-type-1',
            character: '.tag-type-4',
            copyright: '.tag-type-3',
            general: '.tag-type-0',
            studio: '',
            meta: '.tag-type-5',
        }
        for (const tagCategory of ALL_TAG_CATEGORY) {
            const tagLiClass = meta[tagCategory]
            if (!tagLiClass) { continue }
            const tagsOfCategory: Tag[] = []
            let els = sidebarEl.querySelectorAll(tagLiClass)
            els.forEach((el) => {
                const count: number = parseInt(el.querySelector('.post-count')!.getAttribute('title')!)
                const enTag: string = el.querySelector('.search-tag')!.textContent!.trim()
                tagsOfCategory.push({ en: enTag, count })
            })
            fileTags[tagCategory] = tagsOfCategory
        }
        return fileTags
    }
}