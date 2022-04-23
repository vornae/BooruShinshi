import { AbstractModule } from "./abstract"
import { ALL_TAG_CATEGORY, COMMON_TAG_SELECTOR, FileTags, FileTagsElementClass, generalCollectImageInfoList, makeEmptyFileTags, ParsedImageInfo, supported_hostname_t, Tag } from "../common"


export class ModuleRule34PahealNet extends AbstractModule {
    constructor() {
        super()
    }
    hostname(): supported_hostname_t {
        return 'rule34.paheal.net'
    }
    fullName (): string {
        return 'Rule34 Paheal'
    }
    abbrev (): string {
        return 'R3P'
    }
    inPostListPage(): boolean {
        return !!location.pathname.match(/^[/]post[/]list[/][^/]+[/][0-9]+$/)
    }
    inPostContentPage(): boolean {
        return location.pathname.includes('/post/view/')
    }
    getCurrentQueryList(): string[] {
        const m = location.pathname.match(/[/]post[/]list[/]([^/]+?)[/]/)
        if (m) { return m[1].split(' ') }
        return []
    }
    makeQueryUrl(queryList: string[]): string {
        const fmtted = queryList.filter(x => x).map(x=>x.trim()).join(' ')
        return `http://rule34.paheal.net/post/list/${fmtted}/1`
    }
    getPostLinkElementSelector(): string {
        return 'a.shm-thumb-link'
    }
    getPostContentPagePendingElements(): Array<Element | null> {
        return [
            document.querySelector('#main_image'),
            document.querySelector('#Tagsleft'),
            document.querySelector('#ImageInfo'),
        ]
    }
    getPostId(): number {
        const u = new URL(location.href)
        const m = u.pathname.match(/\/post\/view\/([0-9]+)/)
        return m ? ~~m[1] : -1
    }
    collectImageInfoList(): ParsedImageInfo[] {
        const fin: ParsedImageInfo[] = generalCollectImageInfoList()
        const mainImg = document.querySelector('#main_image') as HTMLImageElement
        fin.push({ btnText: `Low (fallback)`, imgUrl: mainImg.src })
        const infoEl = document.querySelector('#ImageInfo')!
        const tds = Array.from(infoEl.querySelectorAll('td'))
        const sizeTd = tds.find(td => td.textContent!.match(/[KMG]B/))
        const size: string = !sizeTd ? 'Unknown Size' : sizeTd.textContent!.match(/([0-9.]+[KMG]B)/)![1]
        const imgLinkTd = tds.find(td => td.textContent!.match(/File Only/))
        const imgLink = imgLinkTd!.querySelector('a')!
        fin.push({ btnText: `High (${size})`, imgUrl: imgLink.href })
        return fin
    }
    collectTags(): FileTags {
        const sidebarEl = document.querySelector('#Tagsleft')
        const fileTags: FileTags = makeEmptyFileTags()
        if (!sidebarEl) {
            console.error('[To Developer] Not found tag')
            return fileTags
        }
        const meta: FileTagsElementClass = {
            artist: '',
            character: '',
            copyright: '',
            general: 'td a.tag_name',
            studio: '',
            meta: '',
        }
        for (const tagCategory of ALL_TAG_CATEGORY) {
            const tagLiClass = meta[tagCategory]
            if (!tagLiClass) { continue }
            const tagsOfCategory: Tag[] = []
            let els = sidebarEl.querySelectorAll(tagLiClass)
            els.forEach((a) => {
                const count: number = ~~a.parentElement!.nextElementSibling!.textContent!.trim()
                const enTag: string = a.textContent!.trim().replaceAll(' ', '_')
                tagsOfCategory.push({ en: enTag, count })
            })
            fileTags[tagCategory] = tagsOfCategory
        }
        return fileTags
    }
}
