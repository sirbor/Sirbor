var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import sourceMapSupport from"source-map-support";import path11 from"path";import chalk from"chalk";import pretty from"pretty-time";var PerfTimer=class{static{__name(this,"PerfTimer")}evts;constructor(){this.evts={},this.addEvent("start")}addEvent(evtName){this.evts[evtName]=process.hrtime()}timeSince(evtName){return chalk.yellow(pretty(process.hrtime(this.evts[evtName??"start"])))}};import{rimraf}from"rimraf";import{isGitIgnored}from"globby";import chalk10 from"chalk";import esbuild from"esbuild";import remarkParse from"remark-parse";import remarkRehype from"remark-rehype";import{unified}from"unified";import{read}from"to-vfile";import{slug as slugAnchor}from"github-slugger";import rfdc from"rfdc";var clone=rfdc();var QUARTZ="quartz";function isRelativeURL(s){let validStart=/^\.{1,2}/.test(s),validEnding=!endsWith(s,"index");return validStart&&validEnding&&![".md",".html"].includes(getFileExtension(s)??"")}__name(isRelativeURL,"isRelativeURL");function sluggify(s){return s.split("/").map(segment=>segment.replace(/\s/g,"-").replace(/&/g,"-and-").replace(/%/g,"-percent").replace(/\?/g,"").replace(/#/g,"")).join("/").replace(/\/$/,"")}__name(sluggify,"sluggify");function slugifyFilePath(fp,excludeExt){fp=stripSlashes(fp);let ext=getFileExtension(fp),withoutFileExt=fp.replace(new RegExp(ext+"$"),"");(excludeExt||[".md",".html",void 0].includes(ext))&&(ext="");let slug=sluggify(withoutFileExt);return endsWith(slug,"_index")&&(slug=slug.replace(/_index$/,"index")),slug+ext}__name(slugifyFilePath,"slugifyFilePath");function simplifySlug(fp){let res=stripSlashes(trimSuffix(fp,"index"),!0);return res.length===0?"/":res}__name(simplifySlug,"simplifySlug");function transformInternalLink(link){let[fplike,anchor]=splitAnchor(decodeURI(link)),folderPath=isFolderPath(fplike),segments=fplike.split("/").filter(x=>x.length>0),prefix=segments.filter(isRelativeSegment).join("/"),fp=segments.filter(seg=>!isRelativeSegment(seg)&&seg!=="").join("/"),simpleSlug=simplifySlug(slugifyFilePath(fp)),joined=joinSegments(stripSlashes(prefix),stripSlashes(simpleSlug)),trail=folderPath?"/":"";return _addRelativeToStart(joined)+trail+anchor}__name(transformInternalLink,"transformInternalLink");var _rebaseHastElement=__name((el,attr,curBase,newBase)=>{if(el.properties?.[attr]){if(!isRelativeURL(String(el.properties[attr])))return;let rel=joinSegments(resolveRelative(curBase,newBase),"..",el.properties[attr]);el.properties[attr]=rel}},"_rebaseHastElement");function normalizeHastElement(rawEl,curBase,newBase){let el=clone(rawEl);return _rebaseHastElement(el,"src",curBase,newBase),_rebaseHastElement(el,"href",curBase,newBase),el.children&&(el.children=el.children.map(child=>normalizeHastElement(child,curBase,newBase))),el}__name(normalizeHastElement,"normalizeHastElement");function pathToRoot(slug){let rootPath=slug.split("/").filter(x=>x!=="").slice(0,-1).map(_=>"..").join("/");return rootPath.length===0&&(rootPath="."),rootPath}__name(pathToRoot,"pathToRoot");function resolveRelative(current,target){return joinSegments(pathToRoot(current),simplifySlug(target))}__name(resolveRelative,"resolveRelative");function splitAnchor(link){let[fp,anchor]=link.split("#",2);return fp.endsWith(".pdf")?[fp,anchor===void 0?"":`#${anchor}`]:(anchor=anchor===void 0?"":"#"+slugAnchor(anchor),[fp,anchor])}__name(splitAnchor,"splitAnchor");function slugTag(tag){return tag.split("/").map(tagSegment=>sluggify(tagSegment)).join("/")}__name(slugTag,"slugTag");function joinSegments(...args){if(args.length===0)return"";let joined=args.filter(segment=>segment!==""&&segment!=="/").map(segment=>stripSlashes(segment)).join("/");return args[0].startsWith("/")&&(joined="/"+joined),args[args.length-1].endsWith("/")&&(joined=joined+"/"),joined}__name(joinSegments,"joinSegments");function getAllSegmentPrefixes(tags){let segments=tags.split("/"),results=[];for(let i=0;i<segments.length;i++)results.push(segments.slice(0,i+1).join("/"));return results}__name(getAllSegmentPrefixes,"getAllSegmentPrefixes");function transformLink(src,target,opts){let targetSlug=transformInternalLink(target);if(opts.strategy==="relative")return targetSlug;{let folderTail=isFolderPath(targetSlug)?"/":"",canonicalSlug=stripSlashes(targetSlug.slice(1)),[targetCanonical,targetAnchor]=splitAnchor(canonicalSlug);if(opts.strategy==="shortest"){let matchingFileNames=opts.allSlugs.filter(slug=>{let fileName=slug.split("/").at(-1);return targetCanonical===fileName});if(matchingFileNames.length===1){let targetSlug2=matchingFileNames[0];return resolveRelative(src,targetSlug2)+targetAnchor}}return joinSegments(pathToRoot(src),canonicalSlug)+folderTail}}__name(transformLink,"transformLink");function isFolderPath(fplike){return fplike.endsWith("/")||endsWith(fplike,"index")||endsWith(fplike,"index.md")||endsWith(fplike,"index.html")}__name(isFolderPath,"isFolderPath");function endsWith(s,suffix){return s===suffix||s.endsWith("/"+suffix)}__name(endsWith,"endsWith");function trimSuffix(s,suffix){return endsWith(s,suffix)&&(s=s.slice(0,-suffix.length)),s}__name(trimSuffix,"trimSuffix");function getFileExtension(s){return s.match(/\.[A-Za-z0-9]+$/)?.[0]}__name(getFileExtension,"getFileExtension");function isRelativeSegment(s){return/^\.{0,2}$/.test(s)}__name(isRelativeSegment,"isRelativeSegment");function stripSlashes(s,onlyStripPrefix){return s.startsWith("/")&&(s=s.substring(1)),!onlyStripPrefix&&s.endsWith("/")&&(s=s.slice(0,-1)),s}__name(stripSlashes,"stripSlashes");function _addRelativeToStart(s){return s===""&&(s="."),s.startsWith(".")||(s=joinSegments(".",s)),s}__name(_addRelativeToStart,"_addRelativeToStart");import path from"path";import workerpool from"workerpool";import truncate from"ansi-truncate";import readline from"readline";var QuartzLogger=class{static{__name(this,"QuartzLogger")}verbose;spinnerInterval;spinnerText="";updateSuffix="";spinnerIndex=0;spinnerChars=["\u280B","\u2819","\u2839","\u2838","\u283C","\u2834","\u2826","\u2827","\u2807","\u280F"];constructor(verbose){let isInteractiveTerminal=process.stdout.isTTY&&process.env.TERM!=="dumb"&&!process.env.CI;this.verbose=verbose||!isInteractiveTerminal}start(text){this.spinnerText=text,this.verbose?console.log(text):(this.spinnerIndex=0,this.spinnerInterval=setInterval(()=>{readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0);let columns=process.stdout.columns||80,output=`${this.spinnerChars[this.spinnerIndex]} ${this.spinnerText}`;this.updateSuffix&&(output+=`: ${this.updateSuffix}`);let truncated=truncate(output,columns);process.stdout.write(truncated),this.spinnerIndex=(this.spinnerIndex+1)%this.spinnerChars.length},50))}updateText(text){this.updateSuffix=text}end(text){!this.verbose&&this.spinnerInterval&&(clearInterval(this.spinnerInterval),this.spinnerInterval=void 0,readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0)),text&&console.log(text)}};import chalk2 from"chalk";import process2 from"process";import{isMainThread}from"workerpool";var rootFile=/.*at file:/;function trace(msg,err){let stack=err.stack??"",lines=[];lines.push(""),lines.push(`
`+chalk2.bgRed.black.bold(" ERROR ")+`

`+chalk2.red(` ${msg}`)+(err.message.length>0?`: ${err.message}`:""));let reachedEndOfLegibleTrace=!1;for(let line of stack.split(`
`).slice(1)){if(reachedEndOfLegibleTrace)break;line.includes("node_modules")||(lines.push(` ${line}`),rootFile.test(line)&&(reachedEndOfLegibleTrace=!0))}let traceMsg=lines.join(`
`);if(isMainThread)console.error(traceMsg),process2.exit(1);else throw new Error(traceMsg)}__name(trace,"trace");import chalk3 from"chalk";function createMdProcessor(ctx){let transformers=ctx.cfg.plugins.transformers;return unified().use(remarkParse).use(transformers.flatMap(plugin=>plugin.markdownPlugins?.(ctx)??[]))}__name(createMdProcessor,"createMdProcessor");function createHtmlProcessor(ctx){let transformers=ctx.cfg.plugins.transformers;return unified().use(remarkRehype,{allowDangerousHtml:!0}).use(transformers.flatMap(plugin=>plugin.htmlPlugins?.(ctx)??[]))}__name(createHtmlProcessor,"createHtmlProcessor");function*chunks(arr,n){for(let i=0;i<arr.length;i+=n)yield arr.slice(i,i+n)}__name(chunks,"chunks");async function transpileWorkerScript(){return esbuild.build({entryPoints:["./quartz/worker.ts"],outfile:path.join(QUARTZ,"./.quartz-cache/transpiled-worker.mjs"),bundle:!0,keepNames:!0,platform:"node",format:"esm",packages:"external",sourcemap:!0,sourcesContent:!1,plugins:[{name:"css-and-scripts-as-text",setup(build){build.onLoad({filter:/\.scss$/},_=>({contents:"",loader:"text"})),build.onLoad({filter:/\.inline\.(ts|js)$/},_=>({contents:"",loader:"text"}))}}]})}__name(transpileWorkerScript,"transpileWorkerScript");function createFileParser(ctx,fps){let{argv,cfg}=ctx;return async processor=>{let res=[];for(let fp of fps)try{let perf=new PerfTimer,file=await read(fp);file.value=file.value.toString().trim();for(let plugin of cfg.plugins.transformers.filter(p=>p.textTransform))file.value=plugin.textTransform(ctx,file.value.toString());file.data.filePath=file.path,file.data.relativePath=path.posix.relative(argv.directory,file.path),file.data.slug=slugifyFilePath(file.data.relativePath);let ast=processor.parse(file),newAst=await processor.run(ast,file);res.push([newAst,file]),argv.verbose&&console.log(`[markdown] ${fp} -> ${file.data.slug} (${perf.timeSince()})`)}catch(err){trace(`
Failed to process markdown \`${fp}\``,err)}return res}}__name(createFileParser,"createFileParser");function createMarkdownParser(ctx,mdContent){return async processor=>{let res=[];for(let[ast,file]of mdContent)try{let perf=new PerfTimer,newAst=await processor.run(ast,file);res.push([newAst,file]),ctx.argv.verbose&&console.log(`[html] ${file.data.slug} (${perf.timeSince()})`)}catch(err){trace(`
Failed to process html \`${file.data.filePath}\``,err)}return res}}__name(createMarkdownParser,"createMarkdownParser");var clamp=__name((num,min,max)=>Math.min(Math.max(Math.round(num),min),max),"clamp");async function parseMarkdown(ctx,fps){let{argv}=ctx,perf=new PerfTimer,log=new QuartzLogger(argv.verbose),CHUNK_SIZE=128,concurrency=ctx.argv.concurrency??clamp(fps.length/CHUNK_SIZE,1,4),res=[];if(log.start(`Parsing input files using ${concurrency} threads`),concurrency===1)try{let mdRes=await createFileParser(ctx,fps)(createMdProcessor(ctx));res=await createMarkdownParser(ctx,mdRes)(createHtmlProcessor(ctx))}catch(error){throw log.end(),error}else{await transpileWorkerScript();let pool=workerpool.pool("./quartz/bootstrap-worker.mjs",{minWorkers:"max",maxWorkers:concurrency,workerType:"thread"}),errorHandler=__name(err=>{console.error(err),process.exit(1)},"errorHandler"),serializableCtx={buildId:ctx.buildId,argv:ctx.argv,allSlugs:ctx.allSlugs,allFiles:ctx.allFiles,incremental:ctx.incremental},textToMarkdownPromises=[],processedFiles=0;for(let chunk of chunks(fps,CHUNK_SIZE))textToMarkdownPromises.push(pool.exec("parseMarkdown",[serializableCtx,chunk]));let mdResults=await Promise.all(textToMarkdownPromises.map(async promise=>{let result=await promise;return processedFiles+=result.length,log.updateText(`text->markdown ${chalk3.gray(`${processedFiles}/${fps.length}`)}`),result})).catch(errorHandler),markdownToHtmlPromises=[];processedFiles=0;for(let mdChunk of mdResults)markdownToHtmlPromises.push(pool.exec("processHtml",[serializableCtx,mdChunk]));res=(await Promise.all(markdownToHtmlPromises.map(async promise=>{let result=await promise;return processedFiles+=result.length,log.updateText(`markdown->html ${chalk3.gray(`${processedFiles}/${fps.length}`)}`),result})).catch(errorHandler)).flat(),await pool.terminate()}return log.end(`Parsed ${res.length} Markdown files in ${perf.timeSince()}`),res}__name(parseMarkdown,"parseMarkdown");function filterContent(ctx,content){let{cfg,argv}=ctx,perf=new PerfTimer,initialLength=content.length;for(let plugin of cfg.plugins.filters){let updatedContent=content.filter(item=>plugin.shouldPublish(ctx,item));if(argv.verbose){let diff=content.filter(x=>!updatedContent.includes(x));for(let file of diff)console.log(`[filter:${plugin.name}] ${file[1].data.slug}`)}content=updatedContent}return console.log(`Filtered out ${initialLength-content.length} files in ${perf.timeSince()}`),content}__name(filterContent,"filterContent");import matter from"gray-matter";import remarkFrontmatter from"remark-frontmatter";import yaml from"js-yaml";import toml from"toml";var en_US_default={propertyDefaults:{title:"Untitled",description:"No description provided"},components:{callout:{note:"Note",abstract:"Abstract",info:"Info",todo:"Todo",tip:"Tip",success:"Success",question:"Question",warning:"Warning",failure:"Failure",danger:"Danger",bug:"Bug",example:"Example",quote:"Quote"},backlinks:{title:"Backlinks",noBacklinksFound:"No backlinks found"},themeToggle:{lightMode:"Light mode",darkMode:"Dark mode"},readerMode:{title:"Reader mode"},explorer:{title:"Explorer"},footer:{createdWith:"Created with"},graph:{title:"Graph View"},recentNotes:{title:"Recent Notes",seeRemainingMore:__name(({remaining})=>`See ${remaining} more \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclude of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link to original"},search:{title:"Search",searchBarPlaceholder:"Search for something"},tableOfContents:{title:"Table of Contents"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"Recent notes",lastFewNotes:__name(({count})=>`Last ${count} notes`,"lastFewNotes")},error:{title:"Not Found",notFound:"Either this page is private or doesn't exist.",home:"Return to Homepage"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"1 item under this folder.":`${count} items under this folder.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag Index",itemsUnderTag:__name(({count})=>count===1?"1 item with this tag.":`${count} items with this tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Showing first ${count} tags.`,"showingFirst"),totalTags:__name(({count})=>`Found ${count} total tags.`,"totalTags")}}};var en_GB_default={propertyDefaults:{title:"Untitled",description:"No description provided"},components:{callout:{note:"Note",abstract:"Abstract",info:"Info",todo:"To-Do",tip:"Tip",success:"Success",question:"Question",warning:"Warning",failure:"Failure",danger:"Danger",bug:"Bug",example:"Example",quote:"Quote"},backlinks:{title:"Backlinks",noBacklinksFound:"No backlinks found"},themeToggle:{lightMode:"Light mode",darkMode:"Dark mode"},readerMode:{title:"Reader mode"},explorer:{title:"Explorer"},footer:{createdWith:"Created with"},graph:{title:"Graph View"},recentNotes:{title:"Recent Notes",seeRemainingMore:__name(({remaining})=>`See ${remaining} more \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclude of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link to original"},search:{title:"Search",searchBarPlaceholder:"Search for something"},tableOfContents:{title:"Table of Contents"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"Recent notes",lastFewNotes:__name(({count})=>`Last ${count} notes`,"lastFewNotes")},error:{title:"Not Found",notFound:"Either this page is private or doesn't exist.",home:"Return to Homepage"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"1 item under this folder.":`${count} items under this folder.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag Index",itemsUnderTag:__name(({count})=>count===1?"1 item with this tag.":`${count} items with this tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Showing first ${count} tags.`,"showingFirst"),totalTags:__name(({count})=>`Found ${count} total tags.`,"totalTags")}}};var fr_FR_default={propertyDefaults:{title:"Sans titre",description:"Aucune description fournie"},components:{callout:{note:"Note",abstract:"R\xE9sum\xE9",info:"Info",todo:"\xC0 faire",tip:"Conseil",success:"Succ\xE8s",question:"Question",warning:"Avertissement",failure:"\xC9chec",danger:"Danger",bug:"Bogue",example:"Exemple",quote:"Citation"},backlinks:{title:"Liens retour",noBacklinksFound:"Aucun lien retour trouv\xE9"},themeToggle:{lightMode:"Mode clair",darkMode:"Mode sombre"},readerMode:{title:"Mode lecture"},explorer:{title:"Explorateur"},footer:{createdWith:"Cr\xE9\xE9 avec"},graph:{title:"Vue Graphique"},recentNotes:{title:"Notes R\xE9centes",seeRemainingMore:__name(({remaining})=>`Voir ${remaining} de plus \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclusion de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Lien vers l'original"},search:{title:"Recherche",searchBarPlaceholder:"Rechercher quelque chose"},tableOfContents:{title:"Table des Mati\xE8res"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min de lecture`,"readingTime")}},pages:{rss:{recentNotes:"Notes r\xE9centes",lastFewNotes:__name(({count})=>`Les derni\xE8res ${count} notes`,"lastFewNotes")},error:{title:"Introuvable",notFound:"Cette page est soit priv\xE9e, soit elle n'existe pas.",home:"Retour \xE0 la page d'accueil"},folderContent:{folder:"Dossier",itemsUnderFolder:__name(({count})=>count===1?"1 \xE9l\xE9ment sous ce dossier.":`${count} \xE9l\xE9ments sous ce dossier.`,"itemsUnderFolder")},tagContent:{tag:"\xC9tiquette",tagIndex:"Index des \xE9tiquettes",itemsUnderTag:__name(({count})=>count===1?"1 \xE9l\xE9ment avec cette \xE9tiquette.":`${count} \xE9l\xE9ments avec cette \xE9tiquette.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Affichage des premi\xE8res ${count} \xE9tiquettes.`,"showingFirst"),totalTags:__name(({count})=>`Trouv\xE9 ${count} \xE9tiquettes au total.`,"totalTags")}}};var it_IT_default={propertyDefaults:{title:"Senza titolo",description:"Nessuna descrizione"},components:{callout:{note:"Nota",abstract:"Astratto",info:"Info",todo:"Da fare",tip:"Consiglio",success:"Completato",question:"Domanda",warning:"Attenzione",failure:"Errore",danger:"Pericolo",bug:"Bug",example:"Esempio",quote:"Citazione"},backlinks:{title:"Link entranti",noBacklinksFound:"Nessun link entrante"},themeToggle:{lightMode:"Tema chiaro",darkMode:"Tema scuro"},readerMode:{title:"Modalit\xE0 lettura"},explorer:{title:"Esplora"},footer:{createdWith:"Creato con"},graph:{title:"Vista grafico"},recentNotes:{title:"Note recenti",seeRemainingMore:__name(({remaining})=>`Vedi ${remaining} altro \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclusione di ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link all'originale"},search:{title:"Cerca",searchBarPlaceholder:"Cerca qualcosa"},tableOfContents:{title:"Tabella dei contenuti"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} minuti`,"readingTime")}},pages:{rss:{recentNotes:"Note recenti",lastFewNotes:__name(({count})=>`Ultime ${count} note`,"lastFewNotes")},error:{title:"Non trovato",notFound:"Questa pagina \xE8 privata o non esiste.",home:"Ritorna alla home page"},folderContent:{folder:"Cartella",itemsUnderFolder:__name(({count})=>count===1?"1 oggetto in questa cartella.":`${count} oggetti in questa cartella.`,"itemsUnderFolder")},tagContent:{tag:"Etichetta",tagIndex:"Indice etichette",itemsUnderTag:__name(({count})=>count===1?"1 oggetto con questa etichetta.":`${count} oggetti con questa etichetta.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Prime ${count} etichette.`,"showingFirst"),totalTags:__name(({count})=>`Trovate ${count} etichette totali.`,"totalTags")}}};var ja_JP_default={propertyDefaults:{title:"\u7121\u984C",description:"\u8AAC\u660E\u306A\u3057"},components:{callout:{note:"\u30CE\u30FC\u30C8",abstract:"\u6284\u9332",info:"\u60C5\u5831",todo:"\u3084\u308B\u3079\u304D\u3053\u3068",tip:"\u30D2\u30F3\u30C8",success:"\u6210\u529F",question:"\u8CEA\u554F",warning:"\u8B66\u544A",failure:"\u5931\u6557",danger:"\u5371\u967A",bug:"\u30D0\u30B0",example:"\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u30D0\u30C3\u30AF\u30EA\u30F3\u30AF",noBacklinksFound:"\u30D0\u30C3\u30AF\u30EA\u30F3\u30AF\u306F\u3042\u308A\u307E\u305B\u3093"},themeToggle:{lightMode:"\u30E9\u30A4\u30C8\u30E2\u30FC\u30C9",darkMode:"\u30C0\u30FC\u30AF\u30E2\u30FC\u30C9"},readerMode:{title:"\u30EA\u30FC\u30C0\u30FC\u30E2\u30FC\u30C9"},explorer:{title:"\u30A8\u30AF\u30B9\u30D7\u30ED\u30FC\u30E9\u30FC"},footer:{createdWith:"\u4F5C\u6210"},graph:{title:"\u30B0\u30E9\u30D5\u30D3\u30E5\u30FC"},recentNotes:{title:"\u6700\u8FD1\u306E\u8A18\u4E8B",seeRemainingMore:__name(({remaining})=>`\u3055\u3089\u306B${remaining}\u4EF6 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug}\u306E\u307E\u3068\u3081`,"transcludeOf"),linkToOriginal:"\u5143\u8A18\u4E8B\u3078\u306E\u30EA\u30F3\u30AF"},search:{title:"\u691C\u7D22",searchBarPlaceholder:"\u691C\u7D22\u30EF\u30FC\u30C9\u3092\u5165\u529B"},tableOfContents:{title:"\u76EE\u6B21"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u306E\u8A18\u4E8B",lastFewNotes:__name(({count})=>`\u6700\u65B0\u306E${count}\u4EF6`,"lastFewNotes")},error:{title:"Not Found",notFound:"\u30DA\u30FC\u30B8\u304C\u5B58\u5728\u3057\u306A\u3044\u304B\u3001\u975E\u516C\u958B\u8A2D\u5B9A\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002",home:"\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8\u306B\u623B\u308B"},folderContent:{folder:"\u30D5\u30A9\u30EB\u30C0",itemsUnderFolder:__name(({count})=>`${count}\u4EF6\u306E\u30DA\u30FC\u30B8`,"itemsUnderFolder")},tagContent:{tag:"\u30BF\u30B0",tagIndex:"\u30BF\u30B0\u4E00\u89A7",itemsUnderTag:__name(({count})=>`${count}\u4EF6\u306E\u30DA\u30FC\u30B8`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u306E\u3046\u3061\u6700\u521D\u306E${count}\u4EF6\u3092\u8868\u793A\u3057\u3066\u3044\u307E\u3059`,"showingFirst"),totalTags:__name(({count})=>`\u5168${count}\u500B\u306E\u30BF\u30B0\u3092\u8868\u793A\u4E2D`,"totalTags")}}};var de_DE_default={propertyDefaults:{title:"Unbenannt",description:"Keine Beschreibung angegeben"},components:{callout:{note:"Hinweis",abstract:"Zusammenfassung",info:"Info",todo:"Zu erledigen",tip:"Tipp",success:"Erfolg",question:"Frage",warning:"Warnung",failure:"Misserfolg",danger:"Gefahr",bug:"Fehler",example:"Beispiel",quote:"Zitat"},backlinks:{title:"Backlinks",noBacklinksFound:"Keine Backlinks gefunden"},themeToggle:{lightMode:"Heller Modus",darkMode:"Dunkler Modus"},readerMode:{title:"Lesemodus"},explorer:{title:"Explorer"},footer:{createdWith:"Erstellt mit"},graph:{title:"Graphansicht"},recentNotes:{title:"Zuletzt bearbeitete Seiten",seeRemainingMore:__name(({remaining})=>`${remaining} weitere ansehen \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transklusion von ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link zum Original"},search:{title:"Suche",searchBarPlaceholder:"Suche nach etwas"},tableOfContents:{title:"Inhaltsverzeichnis"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"Zuletzt bearbeitete Seiten",lastFewNotes:__name(({count})=>`Letzte ${count} Seiten`,"lastFewNotes")},error:{title:"Nicht gefunden",notFound:"Diese Seite ist entweder nicht \xF6ffentlich oder existiert nicht.",home:"Return to Homepage"},folderContent:{folder:"Ordner",itemsUnderFolder:__name(({count})=>count===1?"1 Datei in diesem Ordner.":`${count} Dateien in diesem Ordner.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag-\xDCbersicht",itemsUnderTag:__name(({count})=>count===1?"1 Datei mit diesem Tag.":`${count} Dateien mit diesem Tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Die ersten ${count} Tags werden angezeigt.`,"showingFirst"),totalTags:__name(({count})=>`${count} Tags insgesamt.`,"totalTags")}}};var nl_NL_default={propertyDefaults:{title:"Naamloos",description:"Geen beschrijving gegeven."},components:{callout:{note:"Notitie",abstract:"Samenvatting",info:"Info",todo:"Te doen",tip:"Tip",success:"Succes",question:"Vraag",warning:"Waarschuwing",failure:"Mislukking",danger:"Gevaar",bug:"Bug",example:"Voorbeeld",quote:"Citaat"},backlinks:{title:"Backlinks",noBacklinksFound:"Geen backlinks gevonden"},themeToggle:{lightMode:"Lichte modus",darkMode:"Donkere modus"},readerMode:{title:"Leesmodus"},explorer:{title:"Verkenner"},footer:{createdWith:"Gemaakt met"},graph:{title:"Grafiekweergave"},recentNotes:{title:"Recente notities",seeRemainingMore:__name(({remaining})=>`Zie ${remaining} meer \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Invoeging van ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link naar origineel"},search:{title:"Zoeken",searchBarPlaceholder:"Doorzoek de website"},tableOfContents:{title:"Inhoudsopgave"},contentMeta:{readingTime:__name(({minutes})=>minutes===1?"1 minuut leestijd":`${minutes} minuten leestijd`,"readingTime")}},pages:{rss:{recentNotes:"Recente notities",lastFewNotes:__name(({count})=>`Laatste ${count} notities`,"lastFewNotes")},error:{title:"Niet gevonden",notFound:"Deze pagina is niet zichtbaar of bestaat niet.",home:"Keer terug naar de start pagina"},folderContent:{folder:"Map",itemsUnderFolder:__name(({count})=>count===1?"1 item in deze map.":`${count} items in deze map.`,"itemsUnderFolder")},tagContent:{tag:"Label",tagIndex:"Label-index",itemsUnderTag:__name(({count})=>count===1?"1 item met dit label.":`${count} items met dit label.`,"itemsUnderTag"),showingFirst:__name(({count})=>count===1?"Eerste label tonen.":`Eerste ${count} labels tonen.`,"showingFirst"),totalTags:__name(({count})=>`${count} labels gevonden.`,"totalTags")}}};var ro_RO_default={propertyDefaults:{title:"F\u0103r\u0103 titlu",description:"Nici o descriere furnizat\u0103"},components:{callout:{note:"Not\u0103",abstract:"Rezumat",info:"Informa\u021Bie",todo:"De f\u0103cut",tip:"Sfat",success:"Succes",question:"\xCEntrebare",warning:"Avertisment",failure:"E\u0219ec",danger:"Pericol",bug:"Bug",example:"Exemplu",quote:"Citat"},backlinks:{title:"Leg\u0103turi \xEEnapoi",noBacklinksFound:"Nu s-au g\u0103sit leg\u0103turi \xEEnapoi"},themeToggle:{lightMode:"Modul luminos",darkMode:"Modul \xEEntunecat"},readerMode:{title:"Modul de citire"},explorer:{title:"Explorator"},footer:{createdWith:"Creat cu"},graph:{title:"Graf"},recentNotes:{title:"Noti\u021Be recente",seeRemainingMore:__name(({remaining})=>`Vezi \xEEnc\u0103 ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Extras din ${targetSlug}`,"transcludeOf"),linkToOriginal:"Leg\u0103tur\u0103 c\u0103tre original"},search:{title:"C\u0103utare",searchBarPlaceholder:"Introduce\u021Bi termenul de c\u0103utare..."},tableOfContents:{title:"Cuprins"},contentMeta:{readingTime:__name(({minutes})=>minutes==1?"lectur\u0103 de 1 minut":`lectur\u0103 de ${minutes} minute`,"readingTime")}},pages:{rss:{recentNotes:"Noti\u021Be recente",lastFewNotes:__name(({count})=>`Ultimele ${count} noti\u021Be`,"lastFewNotes")},error:{title:"Pagina nu a fost g\u0103sit\u0103",notFound:"Fie aceast\u0103 pagin\u0103 este privat\u0103, fie nu exist\u0103.",home:"Reveni\u021Bi la pagina de pornire"},folderContent:{folder:"Dosar",itemsUnderFolder:__name(({count})=>count===1?"1 articol \xEEn acest dosar.":`${count} elemente \xEEn acest dosar.`,"itemsUnderFolder")},tagContent:{tag:"Etichet\u0103",tagIndex:"Indexul etichetelor",itemsUnderTag:__name(({count})=>count===1?"1 articol cu aceast\u0103 etichet\u0103.":`${count} articole cu aceast\u0103 etichet\u0103.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Se afi\u0219eaz\u0103 primele ${count} etichete.`,"showingFirst"),totalTags:__name(({count})=>`Au fost g\u0103site ${count} etichete \xEEn total.`,"totalTags")}}};var ca_ES_default={propertyDefaults:{title:"Sense t\xEDtol",description:"Sense descripci\xF3"},components:{callout:{note:"Nota",abstract:"Resum",info:"Informaci\xF3",todo:"Per fer",tip:"Consell",success:"\xC8xit",question:"Pregunta",warning:"Advert\xE8ncia",failure:"Fall",danger:"Perill",bug:"Error",example:"Exemple",quote:"Cita"},backlinks:{title:"Retroenlla\xE7",noBacklinksFound:"No s'han trobat retroenlla\xE7os"},themeToggle:{lightMode:"Mode clar",darkMode:"Mode fosc"},readerMode:{title:"Mode lector"},explorer:{title:"Explorador"},footer:{createdWith:"Creat amb"},graph:{title:"Vista Gr\xE0fica"},recentNotes:{title:"Notes Recents",seeRemainingMore:__name(({remaining})=>`Vegi ${remaining} m\xE9s \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcluit de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Enlla\xE7 a l'original"},search:{title:"Cercar",searchBarPlaceholder:"Cerca alguna cosa"},tableOfContents:{title:"Taula de Continguts"},contentMeta:{readingTime:__name(({minutes})=>`Es llegeix en ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notes recents",lastFewNotes:__name(({count})=>`\xDAltimes ${count} notes`,"lastFewNotes")},error:{title:"No s'ha trobat.",notFound:"Aquesta p\xE0gina \xE9s privada o no existeix.",home:"Torna a la p\xE0gina principal"},folderContent:{folder:"Carpeta",itemsUnderFolder:__name(({count})=>count===1?"1 article en aquesta carpeta.":`${count} articles en esta carpeta.`,"itemsUnderFolder")},tagContent:{tag:"Etiqueta",tagIndex:"\xEDndex d'Etiquetes",itemsUnderTag:__name(({count})=>count===1?"1 article amb aquesta etiqueta.":`${count} article amb aquesta etiqueta.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrant les primeres ${count} etiquetes.`,"showingFirst"),totalTags:__name(({count})=>`S'han trobat ${count} etiquetes en total.`,"totalTags")}}};var es_ES_default={propertyDefaults:{title:"Sin t\xEDtulo",description:"Sin descripci\xF3n"},components:{callout:{note:"Nota",abstract:"Resumen",info:"Informaci\xF3n",todo:"Por hacer",tip:"Consejo",success:"\xC9xito",question:"Pregunta",warning:"Advertencia",failure:"Fallo",danger:"Peligro",bug:"Error",example:"Ejemplo",quote:"Cita"},backlinks:{title:"Retroenlaces",noBacklinksFound:"No se han encontrado retroenlaces"},themeToggle:{lightMode:"Modo claro",darkMode:"Modo oscuro"},readerMode:{title:"Modo lector"},explorer:{title:"Explorador"},footer:{createdWith:"Creado con"},graph:{title:"Vista Gr\xE1fica"},recentNotes:{title:"Notas Recientes",seeRemainingMore:__name(({remaining})=>`Vea ${remaining} m\xE1s \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcluido de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Enlace al original"},search:{title:"Buscar",searchBarPlaceholder:"Busca algo"},tableOfContents:{title:"Tabla de Contenidos"},contentMeta:{readingTime:__name(({minutes})=>`Se lee en ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notas recientes",lastFewNotes:__name(({count})=>`\xDAltimas ${count} notas`,"lastFewNotes")},error:{title:"No se ha encontrado.",notFound:"Esta p\xE1gina es privada o no existe.",home:"Regresa a la p\xE1gina principal"},folderContent:{folder:"Carpeta",itemsUnderFolder:__name(({count})=>count===1?"1 art\xEDculo en esta carpeta.":`${count} art\xEDculos en esta carpeta.`,"itemsUnderFolder")},tagContent:{tag:"Etiqueta",tagIndex:"\xCDndice de Etiquetas",itemsUnderTag:__name(({count})=>count===1?"1 art\xEDculo con esta etiqueta.":`${count} art\xEDculos con esta etiqueta.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrando las primeras ${count} etiquetas.`,"showingFirst"),totalTags:__name(({count})=>`Se han encontrado ${count} etiquetas en total.`,"totalTags")}}};var ar_SA_default={propertyDefaults:{title:"\u063A\u064A\u0631 \u0645\u0639\u0646\u0648\u0646",description:"\u0644\u0645 \u064A\u062A\u0645 \u062A\u0642\u062F\u064A\u0645 \u0623\u064A \u0648\u0635\u0641"},components:{callout:{note:"\u0645\u0644\u0627\u062D\u0638\u0629",abstract:"\u0645\u0644\u062E\u0635",info:"\u0645\u0639\u0644\u0648\u0645\u0627\u062A",todo:"\u0644\u0644\u0642\u064A\u0627\u0645",tip:"\u0646\u0635\u064A\u062D\u0629",success:"\u0646\u062C\u0627\u062D",question:"\u0633\u0624\u0627\u0644",warning:"\u062A\u062D\u0630\u064A\u0631",failure:"\u0641\u0634\u0644",danger:"\u062E\u0637\u0631",bug:"\u062E\u0644\u0644",example:"\u0645\u062B\u0627\u0644",quote:"\u0627\u0642\u062A\u0628\u0627\u0633"},backlinks:{title:"\u0648\u0635\u0644\u0627\u062A \u0627\u0644\u0639\u0648\u062F\u0629",noBacklinksFound:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0635\u0644\u0627\u062A \u0639\u0648\u062F\u0629"},themeToggle:{lightMode:"\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0646\u0647\u0627\u0631\u064A",darkMode:"\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A"},explorer:{title:"\u0627\u0644\u0645\u0633\u062A\u0639\u0631\u0636"},readerMode:{title:"\u0648\u0636\u0639 \u0627\u0644\u0642\u0627\u0631\u0626"},footer:{createdWith:"\u0623\u064F\u0646\u0634\u0626 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645"},graph:{title:"\u0627\u0644\u062A\u0645\u062B\u064A\u0644 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A"},recentNotes:{title:"\u0622\u062E\u0631 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A",seeRemainingMore:__name(({remaining})=>`\u062A\u0635\u0641\u062D ${remaining} \u0623\u0643\u062B\u0631 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0645\u0642\u062A\u0628\u0633 \u0645\u0646 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0648\u0635\u0644\u0629 \u0644\u0644\u0645\u0644\u0627\u062D\u0638\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u0629"},search:{title:"\u0628\u062D\u062B",searchBarPlaceholder:"\u0627\u0628\u062D\u062B \u0639\u0646 \u0634\u064A\u0621 \u0645\u0627"},tableOfContents:{title:"\u0641\u0647\u0631\u0633 \u0627\u0644\u0645\u062D\u062A\u0648\u064A\u0627\u062A"},contentMeta:{readingTime:__name(({minutes})=>minutes==1?"\u062F\u0642\u064A\u0642\u0629 \u0623\u0648 \u0623\u0642\u0644 \u0644\u0644\u0642\u0631\u0627\u0621\u0629":minutes==2?"\u062F\u0642\u064A\u0642\u062A\u0627\u0646 \u0644\u0644\u0642\u0631\u0627\u0621\u0629":`${minutes} \u062F\u0642\u0627\u0626\u0642 \u0644\u0644\u0642\u0631\u0627\u0621\u0629`,"readingTime")}},pages:{rss:{recentNotes:"\u0622\u062E\u0631 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A",lastFewNotes:__name(({count})=>`\u0622\u062E\u0631 ${count} \u0645\u0644\u0627\u062D\u0638\u0629`,"lastFewNotes")},error:{title:"\u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F",notFound:"\u0625\u0645\u0627 \u0623\u0646 \u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062D\u0629 \u062E\u0627\u0635\u0629 \u0623\u0648 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629.",home:"\u0627\u0644\u0639\u0648\u062F\u0647 \u0644\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"},folderContent:{folder:"\u0645\u062C\u0644\u062F",itemsUnderFolder:__name(({count})=>count===1?"\u064A\u0648\u062C\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0641\u0642\u0637 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0644\u062F":`\u064A\u0648\u062C\u062F ${count} \u0639\u0646\u0627\u0635\u0631 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0644\u062F.`,"itemsUnderFolder")},tagContent:{tag:"\u0627\u0644\u0648\u0633\u0645",tagIndex:"\u0645\u0624\u0634\u0631 \u0627\u0644\u0648\u0633\u0645",itemsUnderTag:__name(({count})=>count===1?"\u064A\u0648\u062C\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0641\u0642\u0637 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0648\u0633\u0645":`\u064A\u0648\u062C\u062F ${count} \u0639\u0646\u0627\u0635\u0631 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0648\u0633\u0645.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0625\u0638\u0647\u0627\u0631 \u0623\u0648\u0644 ${count} \u0623\u0648\u0633\u0645\u0629.`,"showingFirst"),totalTags:__name(({count})=>`\u064A\u0648\u062C\u062F ${count} \u0623\u0648\u0633\u0645\u0629.`,"totalTags")}}};var uk_UA_default={propertyDefaults:{title:"\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0438",description:"\u041E\u043F\u0438\u0441 \u043D\u0435 \u043D\u0430\u0434\u0430\u043D\u043E"},components:{callout:{note:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0430",abstract:"\u0410\u0431\u0441\u0442\u0440\u0430\u043A\u0442",info:"\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0456\u044F",todo:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F",tip:"\u041F\u043E\u0440\u0430\u0434\u0430",success:"\u0423\u0441\u043F\u0456\u0445",question:"\u041F\u0438\u0442\u0430\u043D\u043D\u044F",warning:"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",failure:"\u041D\u0435\u0432\u0434\u0430\u0447\u0430",danger:"\u041D\u0435\u0431\u0435\u0437\u043F\u0435\u043A\u0430",bug:"\u0411\u0430\u0433",example:"\u041F\u0440\u0438\u043A\u043B\u0430\u0434",quote:"\u0426\u0438\u0442\u0430\u0442\u0430"},backlinks:{title:"\u0417\u0432\u043E\u0440\u043E\u0442\u043D\u0456 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",noBacklinksFound:"\u0417\u0432\u043E\u0440\u043E\u0442\u043D\u0438\u0445 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u044C \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E"},themeToggle:{lightMode:"\u0421\u0432\u0456\u0442\u043B\u0438\u0439 \u0440\u0435\u0436\u0438\u043C",darkMode:"\u0422\u0435\u043C\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C"},readerMode:{title:"\u0420\u0435\u0436\u0438\u043C \u0447\u0438\u0442\u0430\u043D\u043D\u044F"},explorer:{title:"\u041F\u0440\u043E\u0432\u0456\u0434\u043D\u0438\u043A"},footer:{createdWith:"\u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043E \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E"},graph:{title:"\u0412\u0438\u0433\u043B\u044F\u0434 \u0433\u0440\u0430\u0444\u0430"},recentNotes:{title:"\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438",seeRemainingMore:__name(({remaining})=>`\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u043D\u0443\u0442\u0438 \u0449\u0435 ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0412\u0438\u0434\u043E\u0431\u0443\u0442\u043E \u0437 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u043D\u0430 \u043E\u0440\u0438\u0433\u0456\u043D\u0430\u043B"},search:{title:"\u041F\u043E\u0448\u0443\u043A",searchBarPlaceholder:"\u0428\u0443\u043A\u0430\u0442\u0438 \u0449\u043E\u0441\u044C"},tableOfContents:{title:"\u0417\u043C\u0456\u0441\u0442"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} \u0445\u0432 \u0447\u0438\u0442\u0430\u043D\u043D\u044F`,"readingTime")}},pages:{rss:{recentNotes:"\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438",lastFewNotes:__name(({count})=>`\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438: ${count}`,"lastFewNotes")},error:{title:"\u041D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E",notFound:"\u0426\u044F \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0430 \u0430\u0431\u043E \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u0430, \u0430\u0431\u043E \u043D\u0435 \u0456\u0441\u043D\u0443\u0454.",home:"\u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438\u0441\u044F \u043D\u0430 \u0433\u043E\u043B\u043E\u0432\u043D\u0443 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0443"},folderContent:{folder:"\u0422\u0435\u043A\u0430",itemsUnderFolder:__name(({count})=>count===1?"\u0423 \u0446\u0456\u0439 \u0442\u0435\u0446\u0456 1 \u0435\u043B\u0435\u043C\u0435\u043D\u0442.":`\u0415\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 \u0443 \u0446\u0456\u0439 \u0442\u0435\u0446\u0456: ${count}.`,"itemsUnderFolder")},tagContent:{tag:"\u041C\u0456\u0442\u043A\u0430",tagIndex:"\u0406\u043D\u0434\u0435\u043A\u0441 \u043C\u0456\u0442\u043A\u0438",itemsUnderTag:__name(({count})=>count===1?"1 \u0435\u043B\u0435\u043C\u0435\u043D\u0442 \u0437 \u0446\u0456\u0454\u044E \u043C\u0456\u0442\u043A\u043E\u044E.":`\u0415\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 \u0437 \u0446\u0456\u0454\u044E \u043C\u0456\u0442\u043A\u043E\u044E: ${count}.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u041F\u043E\u043A\u0430\u0437 \u043F\u0435\u0440\u0448\u0438\u0445 ${count} \u043C\u0456\u0442\u043E\u043A.`,"showingFirst"),totalTags:__name(({count})=>`\u0412\u0441\u044C\u043E\u0433\u043E \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043C\u0456\u0442\u043E\u043A: ${count}.`,"totalTags")}}};var ru_RU_default={propertyDefaults:{title:"\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F",description:"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442"},components:{callout:{note:"\u0417\u0430\u043C\u0435\u0442\u043A\u0430",abstract:"\u0420\u0435\u0437\u044E\u043C\u0435",info:"\u0418\u043D\u0444\u043E",todo:"\u0421\u0434\u0435\u043B\u0430\u0442\u044C",tip:"\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430",success:"\u0423\u0441\u043F\u0435\u0445",question:"\u0412\u043E\u043F\u0440\u043E\u0441",warning:"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435",failure:"\u041D\u0435\u0443\u0434\u0430\u0447\u0430",danger:"\u041E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C",bug:"\u0411\u0430\u0433",example:"\u041F\u0440\u0438\u043C\u0435\u0440",quote:"\u0426\u0438\u0442\u0430\u0442\u0430"},backlinks:{title:"\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438",noBacklinksFound:"\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442"},themeToggle:{lightMode:"\u0421\u0432\u0435\u0442\u043B\u044B\u0439 \u0440\u0435\u0436\u0438\u043C",darkMode:"\u0422\u0451\u043C\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C"},readerMode:{title:"\u0420\u0435\u0436\u0438\u043C \u0447\u0442\u0435\u043D\u0438\u044F"},explorer:{title:"\u041F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A"},footer:{createdWith:"\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E"},graph:{title:"\u0412\u0438\u0434 \u0433\u0440\u0430\u0444\u0430"},recentNotes:{title:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",seeRemainingMore:__name(({remaining})=>`\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043E\u0441\u0442\u0430\u0432\u0448${getForm(remaining,"\u0443\u044E\u0441\u044F","\u0438\u0435\u0441\u044F","\u0438\u0435\u0441\u044F")} ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u0438\u0437 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B"},search:{title:"\u041F\u043E\u0438\u0441\u043A",searchBarPlaceholder:"\u041D\u0430\u0439\u0442\u0438 \u0447\u0442\u043E-\u043D\u0438\u0431\u0443\u0434\u044C"},tableOfContents:{title:"\u041E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u0435"},contentMeta:{readingTime:__name(({minutes})=>`\u0432\u0440\u0435\u043C\u044F \u0447\u0442\u0435\u043D\u0438\u044F ~${minutes} \u043C\u0438\u043D.`,"readingTime")}},pages:{rss:{recentNotes:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",lastFewNotes:__name(({count})=>`\u041F\u043E\u0441\u043B\u0435\u0434\u043D${getForm(count,"\u044F\u044F","\u0438\u0435","\u0438\u0435")} ${count} \u0437\u0430\u043C\u0435\u0442${getForm(count,"\u043A\u0430","\u043A\u0438","\u043E\u043A")}`,"lastFewNotes")},error:{title:"\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430",notFound:"\u042D\u0442\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u0430\u044F \u0438\u043B\u0438 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",home:"\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443"},folderContent:{folder:"\u041F\u0430\u043F\u043A\u0430",itemsUnderFolder:__name(({count})=>`\u0432 \u044D\u0442\u043E\u0439 \u043F\u0430\u043F\u043A\u0435 ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442${getForm(count,"","\u0430","\u043E\u0432")}`,"itemsUnderFolder")},tagContent:{tag:"\u0422\u0435\u0433",tagIndex:"\u0418\u043D\u0434\u0435\u043A\u0441 \u0442\u0435\u0433\u043E\u0432",itemsUnderTag:__name(({count})=>`\u0441 \u044D\u0442\u0438\u043C \u0442\u0435\u0433\u043E\u043C ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442${getForm(count,"","\u0430","\u043E\u0432")}`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430${getForm(count,"\u0435\u0442\u0441\u044F","\u044E\u0442\u0441\u044F","\u044E\u0442\u0441\u044F")} ${count} \u0442\u0435\u0433${getForm(count,"","\u0430","\u043E\u0432")}`,"showingFirst"),totalTags:__name(({count})=>`\u0412\u0441\u0435\u0433\u043E ${count} \u0442\u0435\u0433${getForm(count,"","\u0430","\u043E\u0432")}`,"totalTags")}}};function getForm(number,form1,form2,form5){let remainder100=number%100,remainder10=remainder100%10;return remainder100>=10&&remainder100<=20?form5:remainder10>1&&remainder10<5?form2:remainder10==1?form1:form5}__name(getForm,"getForm");var ko_KR_default={propertyDefaults:{title:"\uC81C\uBAA9 \uC5C6\uC74C",description:"\uC124\uBA85 \uC5C6\uC74C"},components:{callout:{note:"\uB178\uD2B8",abstract:"\uAC1C\uC694",info:"\uC815\uBCF4",todo:"\uD560\uC77C",tip:"\uD301",success:"\uC131\uACF5",question:"\uC9C8\uBB38",warning:"\uC8FC\uC758",failure:"\uC2E4\uD328",danger:"\uC704\uD5D8",bug:"\uBC84\uADF8",example:"\uC608\uC2DC",quote:"\uC778\uC6A9"},backlinks:{title:"\uBC31\uB9C1\uD06C",noBacklinksFound:"\uBC31\uB9C1\uD06C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."},themeToggle:{lightMode:"\uB77C\uC774\uD2B8 \uBAA8\uB4DC",darkMode:"\uB2E4\uD06C \uBAA8\uB4DC"},readerMode:{title:"\uB9AC\uB354 \uBAA8\uB4DC"},explorer:{title:"\uD0D0\uC0C9\uAE30"},footer:{createdWith:"Created with"},graph:{title:"\uADF8\uB798\uD504 \uBDF0"},recentNotes:{title:"\uCD5C\uADFC \uAC8C\uC2DC\uAE00",seeRemainingMore:__name(({remaining})=>`${remaining}\uAC74 \uB354\uBCF4\uAE30 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug}\uC758 \uD3EC\uD568`,"transcludeOf"),linkToOriginal:"\uC6D0\uBCF8 \uB9C1\uD06C"},search:{title:"\uAC80\uC0C9",searchBarPlaceholder:"\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD558\uC138\uC694"},tableOfContents:{title:"\uBAA9\uCC28"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"\uCD5C\uADFC \uAC8C\uC2DC\uAE00",lastFewNotes:__name(({count})=>`\uCD5C\uADFC ${count} \uAC74`,"lastFewNotes")},error:{title:"Not Found",notFound:"\uD398\uC774\uC9C0\uAC00 \uC874\uC7AC\uD558\uC9C0 \uC54A\uAC70\uB098 \uBE44\uACF5\uAC1C \uC124\uC815\uC774 \uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.",home:"\uD648\uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30"},folderContent:{folder:"\uD3F4\uB354",itemsUnderFolder:__name(({count})=>`${count}\uAC74\uC758 \uD56D\uBAA9`,"itemsUnderFolder")},tagContent:{tag:"\uD0DC\uADF8",tagIndex:"\uD0DC\uADF8 \uBAA9\uB85D",itemsUnderTag:__name(({count})=>`${count}\uAC74\uC758 \uD56D\uBAA9`,"itemsUnderTag"),showingFirst:__name(({count})=>`\uCC98\uC74C ${count}\uAC1C\uC758 \uD0DC\uADF8`,"showingFirst"),totalTags:__name(({count})=>`\uCD1D ${count}\uAC1C\uC758 \uD0DC\uADF8\uB97C \uCC3E\uC558\uC2B5\uB2C8\uB2E4.`,"totalTags")}}};var zh_CN_default={propertyDefaults:{title:"\u65E0\u9898",description:"\u65E0\u63CF\u8FF0"},components:{callout:{note:"\u7B14\u8BB0",abstract:"\u6458\u8981",info:"\u63D0\u793A",todo:"\u5F85\u529E",tip:"\u63D0\u793A",success:"\u6210\u529F",question:"\u95EE\u9898",warning:"\u8B66\u544A",failure:"\u5931\u8D25",danger:"\u5371\u9669",bug:"\u9519\u8BEF",example:"\u793A\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u53CD\u5411\u94FE\u63A5",noBacklinksFound:"\u65E0\u6CD5\u627E\u5230\u53CD\u5411\u94FE\u63A5"},themeToggle:{lightMode:"\u4EAE\u8272\u6A21\u5F0F",darkMode:"\u6697\u8272\u6A21\u5F0F"},readerMode:{title:"\u9605\u8BFB\u6A21\u5F0F"},explorer:{title:"\u63A2\u7D22"},footer:{createdWith:"Created with"},graph:{title:"\u5173\u7CFB\u56FE\u8C31"},recentNotes:{title:"\u6700\u8FD1\u7684\u7B14\u8BB0",seeRemainingMore:__name(({remaining})=>`\u67E5\u770B\u66F4\u591A${remaining}\u7BC7\u7B14\u8BB0 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u5305\u542B${targetSlug}`,"transcludeOf"),linkToOriginal:"\u6307\u5411\u539F\u59CB\u7B14\u8BB0\u7684\u94FE\u63A5"},search:{title:"\u641C\u7D22",searchBarPlaceholder:"\u641C\u7D22\u4E9B\u4EC0\u4E48"},tableOfContents:{title:"\u76EE\u5F55"},contentMeta:{readingTime:__name(({minutes})=>`${minutes}\u5206\u949F\u9605\u8BFB`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u7684\u7B14\u8BB0",lastFewNotes:__name(({count})=>`\u6700\u8FD1\u7684${count}\u6761\u7B14\u8BB0`,"lastFewNotes")},error:{title:"\u65E0\u6CD5\u627E\u5230",notFound:"\u79C1\u6709\u7B14\u8BB0\u6216\u7B14\u8BB0\u4E0D\u5B58\u5728\u3002",home:"\u8FD4\u56DE\u9996\u9875"},folderContent:{folder:"\u6587\u4EF6\u5939",itemsUnderFolder:__name(({count})=>`\u6B64\u6587\u4EF6\u5939\u4E0B\u6709${count}\u6761\u7B14\u8BB0\u3002`,"itemsUnderFolder")},tagContent:{tag:"\u6807\u7B7E",tagIndex:"\u6807\u7B7E\u7D22\u5F15",itemsUnderTag:__name(({count})=>`\u6B64\u6807\u7B7E\u4E0B\u6709${count}\u6761\u7B14\u8BB0\u3002`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u663E\u793A\u524D${count}\u4E2A\u6807\u7B7E\u3002`,"showingFirst"),totalTags:__name(({count})=>`\u603B\u5171\u6709${count}\u4E2A\u6807\u7B7E\u3002`,"totalTags")}}};var zh_TW_default={propertyDefaults:{title:"\u7121\u984C",description:"\u7121\u63CF\u8FF0"},components:{callout:{note:"\u7B46\u8A18",abstract:"\u6458\u8981",info:"\u63D0\u793A",todo:"\u5F85\u8FA6",tip:"\u63D0\u793A",success:"\u6210\u529F",question:"\u554F\u984C",warning:"\u8B66\u544A",failure:"\u5931\u6557",danger:"\u5371\u96AA",bug:"\u932F\u8AA4",example:"\u7BC4\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u53CD\u5411\u9023\u7D50",noBacklinksFound:"\u7121\u6CD5\u627E\u5230\u53CD\u5411\u9023\u7D50"},themeToggle:{lightMode:"\u4EAE\u8272\u6A21\u5F0F",darkMode:"\u6697\u8272\u6A21\u5F0F"},readerMode:{title:"\u95B1\u8B80\u6A21\u5F0F"},explorer:{title:"\u63A2\u7D22"},footer:{createdWith:"Created with"},graph:{title:"\u95DC\u4FC2\u5716\u8B5C"},recentNotes:{title:"\u6700\u8FD1\u7684\u7B46\u8A18",seeRemainingMore:__name(({remaining})=>`\u67E5\u770B\u66F4\u591A ${remaining} \u7BC7\u7B46\u8A18 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u5305\u542B ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u6307\u5411\u539F\u59CB\u7B46\u8A18\u7684\u9023\u7D50"},search:{title:"\u641C\u5C0B",searchBarPlaceholder:"\u641C\u5C0B\u4E9B\u4EC0\u9EBC"},tableOfContents:{title:"\u76EE\u9304"},contentMeta:{readingTime:__name(({minutes})=>`\u95B1\u8B80\u6642\u9593\u7D04 ${minutes} \u5206\u9418`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u7684\u7B46\u8A18",lastFewNotes:__name(({count})=>`\u6700\u8FD1\u7684 ${count} \u689D\u7B46\u8A18`,"lastFewNotes")},error:{title:"\u7121\u6CD5\u627E\u5230",notFound:"\u79C1\u4EBA\u7B46\u8A18\u6216\u7B46\u8A18\u4E0D\u5B58\u5728\u3002",home:"\u8FD4\u56DE\u9996\u9801"},folderContent:{folder:"\u8CC7\u6599\u593E",itemsUnderFolder:__name(({count})=>`\u6B64\u8CC7\u6599\u593E\u4E0B\u6709 ${count} \u689D\u7B46\u8A18\u3002`,"itemsUnderFolder")},tagContent:{tag:"\u6A19\u7C64",tagIndex:"\u6A19\u7C64\u7D22\u5F15",itemsUnderTag:__name(({count})=>`\u6B64\u6A19\u7C64\u4E0B\u6709 ${count} \u689D\u7B46\u8A18\u3002`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u986F\u793A\u524D ${count} \u500B\u6A19\u7C64\u3002`,"showingFirst"),totalTags:__name(({count})=>`\u7E3D\u5171\u6709 ${count} \u500B\u6A19\u7C64\u3002`,"totalTags")}}};var vi_VN_default={propertyDefaults:{title:"Kh\xF4ng c\xF3 ti\xEAu \u0111\u1EC1",description:"Kh\xF4ng c\xF3 m\xF4 t\u1EA3 \u0111\u01B0\u1EE3c cung c\u1EA5p"},components:{callout:{note:"Ghi Ch\xFA",abstract:"T\xF3m T\u1EAFt",info:"Th\xF4ng tin",todo:"C\u1EA7n L\xE0m",tip:"G\u1EE3i \xDD",success:"Th\xE0nh C\xF4ng",question:"Nghi V\u1EA5n",warning:"C\u1EA3nh B\xE1o",failure:"Th\u1EA5t B\u1EA1i",danger:"Nguy Hi\u1EC3m",bug:"L\u1ED7i",example:"V\xED D\u1EE5",quote:"Tr\xEDch D\u1EABn"},backlinks:{title:"Li\xEAn K\u1EBFt Ng\u01B0\u1EE3c",noBacklinksFound:"Kh\xF4ng c\xF3 li\xEAn k\u1EBFt ng\u01B0\u1EE3c \u0111\u01B0\u1EE3c t\xECm th\u1EA5y"},themeToggle:{lightMode:"S\xE1ng",darkMode:"T\u1ED1i"},readerMode:{title:"Ch\u1EBF \u0111\u1ED9 \u0111\u1ECDc"},explorer:{title:"Trong b\xE0i n\xE0y"},footer:{createdWith:"\u0110\u01B0\u1EE3c t\u1EA1o b\u1EDFi"},graph:{title:"Bi\u1EC3u \u0110\u1ED3"},recentNotes:{title:"B\xE0i vi\u1EBFt g\u1EA7n \u0111\xE2y",seeRemainingMore:__name(({remaining})=>`Xem ${remaining} th\xEAm \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Bao g\u1ED3m ${targetSlug}`,"transcludeOf"),linkToOriginal:"Li\xEAn K\u1EBFt G\u1ED1c"},search:{title:"T\xECm Ki\u1EBFm",searchBarPlaceholder:"T\xECm ki\u1EBFm th\xF4ng tin"},tableOfContents:{title:"B\u1EA3ng N\u1ED9i Dung"},contentMeta:{readingTime:__name(({minutes})=>`\u0111\u1ECDc ${minutes} ph\xFAt`,"readingTime")}},pages:{rss:{recentNotes:"Nh\u1EEFng b\xE0i g\u1EA7n \u0111\xE2y",lastFewNotes:__name(({count})=>`${count} B\xE0i g\u1EA7n \u0111\xE2y`,"lastFewNotes")},error:{title:"Kh\xF4ng T\xECm Th\u1EA5y",notFound:"Trang n\xE0y \u0111\u01B0\u1EE3c b\u1EA3o m\u1EADt ho\u1EB7c kh\xF4ng t\u1ED3n t\u1EA1i.",home:"Tr\u1EDF v\u1EC1 trang ch\u1EE7"},folderContent:{folder:"Th\u01B0 M\u1EE5c",itemsUnderFolder:__name(({count})=>count===1?"1 m\u1EE5c trong th\u01B0 m\u1EE5c n\xE0y.":`${count} m\u1EE5c trong th\u01B0 m\u1EE5c n\xE0y.`,"itemsUnderFolder")},tagContent:{tag:"Th\u1EBB",tagIndex:"Th\u1EBB M\u1EE5c L\u1EE5c",itemsUnderTag:__name(({count})=>count===1?"1 m\u1EE5c g\u1EAFn th\u1EBB n\xE0y.":`${count} m\u1EE5c g\u1EAFn th\u1EBB n\xE0y.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Hi\u1EC3n th\u1ECB tr\u01B0\u1EDBc ${count} th\u1EBB.`,"showingFirst"),totalTags:__name(({count})=>`T\xECm th\u1EA5y ${count} th\u1EBB t\u1ED5ng c\u1ED9ng.`,"totalTags")}}};var pt_BR_default={propertyDefaults:{title:"Sem t\xEDtulo",description:"Sem descri\xE7\xE3o"},components:{callout:{note:"Nota",abstract:"Abstrato",info:"Info",todo:"Pend\xEAncia",tip:"Dica",success:"Sucesso",question:"Pergunta",warning:"Aviso",failure:"Falha",danger:"Perigo",bug:"Bug",example:"Exemplo",quote:"Cita\xE7\xE3o"},backlinks:{title:"Backlinks",noBacklinksFound:"Sem backlinks encontrados"},themeToggle:{lightMode:"Tema claro",darkMode:"Tema escuro"},readerMode:{title:"Modo leitor"},explorer:{title:"Explorador"},footer:{createdWith:"Criado com"},graph:{title:"Vis\xE3o de gr\xE1fico"},recentNotes:{title:"Notas recentes",seeRemainingMore:__name(({remaining})=>`Veja mais ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcrever de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link ao original"},search:{title:"Pesquisar",searchBarPlaceholder:"Pesquisar por algo"},tableOfContents:{title:"Sum\xE1rio"},contentMeta:{readingTime:__name(({minutes})=>`Leitura de ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notas recentes",lastFewNotes:__name(({count})=>`\xDAltimas ${count} notas`,"lastFewNotes")},error:{title:"N\xE3o encontrado",notFound:"Esta p\xE1gina \xE9 privada ou n\xE3o existe.",home:"Retornar a p\xE1gina inicial"},folderContent:{folder:"Arquivo",itemsUnderFolder:__name(({count})=>count===1?"1 item neste arquivo.":`${count} items neste arquivo.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Sum\xE1rio de Tags",itemsUnderTag:__name(({count})=>count===1?"1 item com esta tag.":`${count} items com esta tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrando as ${count} primeiras tags.`,"showingFirst"),totalTags:__name(({count})=>`Encontradas ${count} tags.`,"totalTags")}}};var hu_HU_default={propertyDefaults:{title:"N\xE9vtelen",description:"Nincs le\xEDr\xE1s"},components:{callout:{note:"Jegyzet",abstract:"Abstract",info:"Inform\xE1ci\xF3",todo:"Tennival\xF3",tip:"Tipp",success:"Siker",question:"K\xE9rd\xE9s",warning:"Figyelmeztet\xE9s",failure:"Hiba",danger:"Vesz\xE9ly",bug:"Bug",example:"P\xE9lda",quote:"Id\xE9zet"},backlinks:{title:"Visszautal\xE1sok",noBacklinksFound:"Nincs visszautal\xE1s"},themeToggle:{lightMode:"Vil\xE1gos m\xF3d",darkMode:"S\xF6t\xE9t m\xF3d"},readerMode:{title:"Olvas\xF3 m\xF3d"},explorer:{title:"F\xE1jlb\xF6ng\xE9sz\u0151"},footer:{createdWith:"K\xE9sz\xEDtve ezzel:"},graph:{title:"Grafikonn\xE9zet"},recentNotes:{title:"Legut\xF3bbi jegyzetek",seeRemainingMore:__name(({remaining})=>`${remaining} tov\xE1bbi megtekint\xE9se \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug} \xE1thivatkoz\xE1sa`,"transcludeOf"),linkToOriginal:"Hivatkoz\xE1s az eredetire"},search:{title:"Keres\xE9s",searchBarPlaceholder:"Keress valamire"},tableOfContents:{title:"Tartalomjegyz\xE9k"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} perces olvas\xE1s`,"readingTime")}},pages:{rss:{recentNotes:"Legut\xF3bbi jegyzetek",lastFewNotes:__name(({count})=>`Legut\xF3bbi ${count} jegyzet`,"lastFewNotes")},error:{title:"Nem tal\xE1lhat\xF3",notFound:"Ez a lap vagy priv\xE1t vagy nem l\xE9tezik.",home:"Vissza a kezd\u0151lapra"},folderContent:{folder:"Mappa",itemsUnderFolder:__name(({count})=>`Ebben a mapp\xE1ban ${count} elem tal\xE1lhat\xF3.`,"itemsUnderFolder")},tagContent:{tag:"C\xEDmke",tagIndex:"C\xEDmke index",itemsUnderTag:__name(({count})=>`${count} elem tal\xE1lhat\xF3 ezzel a c\xEDmk\xE9vel.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Els\u0151 ${count} c\xEDmke megjelen\xEDtve.`,"showingFirst"),totalTags:__name(({count})=>`\xD6sszesen ${count} c\xEDmke tal\xE1lhat\xF3.`,"totalTags")}}};var fa_IR_default={propertyDefaults:{title:"\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",description:"\u062A\u0648\u0636\u06CC\u062D \u062E\u0627\u0635\u06CC \u0627\u0636\u0627\u0641\u0647 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A"},components:{callout:{note:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A",abstract:"\u0686\u06A9\u06CC\u062F\u0647",info:"\u0627\u0637\u0644\u0627\u0639\u0627\u062A",todo:"\u0627\u0642\u062F\u0627\u0645",tip:"\u0646\u06A9\u062A\u0647",success:"\u062A\u06CC\u06A9",question:"\u0633\u0624\u0627\u0644",warning:"\u0647\u0634\u062F\u0627\u0631",failure:"\u0634\u06A9\u0633\u062A",danger:"\u062E\u0637\u0631",bug:"\u0628\u0627\u06AF",example:"\u0645\u062B\u0627\u0644",quote:"\u0646\u0642\u0644 \u0642\u0648\u0644"},backlinks:{title:"\u0628\u06A9\u200C\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627",noBacklinksFound:"\u0628\u062F\u0648\u0646 \u0628\u06A9\u200C\u0644\u06CC\u0646\u06A9"},themeToggle:{lightMode:"\u062D\u0627\u0644\u062A \u0631\u0648\u0634\u0646",darkMode:"\u062D\u0627\u0644\u062A \u062A\u0627\u0631\u06CC\u06A9"},readerMode:{title:"\u062D\u0627\u0644\u062A \u062E\u0648\u0627\u0646\u062F\u0646"},explorer:{title:"\u0645\u0637\u0627\u0644\u0628"},footer:{createdWith:"\u0633\u0627\u062E\u062A\u0647 \u0634\u062F\u0647 \u0628\u0627"},graph:{title:"\u0646\u0645\u0627\u06CC \u06AF\u0631\u0627\u0641"},recentNotes:{title:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631",seeRemainingMore:__name(({remaining})=>`${remaining} \u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u062F\u06CC\u06AF\u0631 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0627\u0632 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u067E\u06CC\u0648\u0646\u062F \u0628\u0647 \u0627\u0635\u0644\u06CC"},search:{title:"\u062C\u0633\u062A\u062C\u0648",searchBarPlaceholder:"\u0645\u0637\u0644\u0628\u06CC \u0631\u0627 \u062C\u0633\u062A\u062C\u0648 \u06A9\u0646\u06CC\u062F"},tableOfContents:{title:"\u0641\u0647\u0631\u0633\u062A"},contentMeta:{readingTime:__name(({minutes})=>`\u0632\u0645\u0627\u0646 \u062A\u0642\u0631\u06CC\u0628\u06CC \u0645\u0637\u0627\u0644\u0639\u0647: ${minutes} \u062F\u0642\u06CC\u0642\u0647`,"readingTime")}},pages:{rss:{recentNotes:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631",lastFewNotes:__name(({count})=>`${count} \u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u0627\u062E\u06CC\u0631`,"lastFewNotes")},error:{title:"\u06CC\u0627\u0641\u062A \u0646\u0634\u062F",notFound:"\u0627\u06CC\u0646 \u0635\u0641\u062D\u0647 \u06CC\u0627 \u062E\u0635\u0648\u0635\u06CC \u0627\u0633\u062A \u06CC\u0627 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F",home:"\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC"},folderContent:{folder:"\u067E\u0648\u0634\u0647",itemsUnderFolder:__name(({count})=>count===1?".\u06CC\u06A9 \u0645\u0637\u0644\u0628 \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0627\u0633\u062A":`${count} \u0645\u0637\u0644\u0628 \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0627\u0633\u062A.`,"itemsUnderFolder")},tagContent:{tag:"\u0628\u0631\u0686\u0633\u0628",tagIndex:"\u0641\u0647\u0631\u0633\u062A \u0628\u0631\u0686\u0633\u0628\u200C\u0647\u0627",itemsUnderTag:__name(({count})=>count===1?"\u06CC\u06A9 \u0645\u0637\u0644\u0628 \u0628\u0627 \u0627\u06CC\u0646 \u0628\u0631\u0686\u0633\u0628":`${count} \u0645\u0637\u0644\u0628 \u0628\u0627 \u0627\u06CC\u0646 \u0628\u0631\u0686\u0633\u0628.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u062F\u0631 \u062D\u0627\u0644 \u0646\u0645\u0627\u06CC\u0634 ${count} \u0628\u0631\u0686\u0633\u0628.`,"showingFirst"),totalTags:__name(({count})=>`${count} \u0628\u0631\u0686\u0633\u0628 \u06CC\u0627\u0641\u062A \u0634\u062F.`,"totalTags")}}};var pl_PL_default={propertyDefaults:{title:"Bez nazwy",description:"Brak opisu"},components:{callout:{note:"Notatka",abstract:"Streszczenie",info:"informacja",todo:"Do zrobienia",tip:"Wskaz\xF3wka",success:"Zrobione",question:"Pytanie",warning:"Ostrze\u017Cenie",failure:"Usterka",danger:"Niebiezpiecze\u0144stwo",bug:"B\u0142\u0105d w kodzie",example:"Przyk\u0142ad",quote:"Cytat"},backlinks:{title:"Odno\u015Bniki zwrotne",noBacklinksFound:"Brak po\u0142\u0105cze\u0144 zwrotnych"},themeToggle:{lightMode:"Trzyb jasny",darkMode:"Tryb ciemny"},readerMode:{title:"Tryb czytania"},explorer:{title:"Przegl\u0105daj"},footer:{createdWith:"Stworzone z u\u017Cyciem"},graph:{title:"Graf"},recentNotes:{title:"Najnowsze notatki",seeRemainingMore:__name(({remaining})=>`Zobacz ${remaining} nastepnych \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Osadzone ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0141\u0105cze do orygina\u0142u"},search:{title:"Szukaj",searchBarPlaceholder:"Search for something"},tableOfContents:{title:"Spis tre\u015Bci"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min. czytania `,"readingTime")}},pages:{rss:{recentNotes:"Najnowsze notatki",lastFewNotes:__name(({count})=>`Ostatnie ${count} notatek`,"lastFewNotes")},error:{title:"Nie znaleziono",notFound:"Ta strona jest prywatna lub nie istnieje.",home:"Powr\xF3t do strony g\u0142\xF3wnej"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"W tym folderze jest 1 element.":`Element\xF3w w folderze: ${count}.`,"itemsUnderFolder")},tagContent:{tag:"Znacznik",tagIndex:"Spis znacznik\xF3w",itemsUnderTag:__name(({count})=>count===1?"Oznaczony 1 element.":`Element\xF3w z tym znacznikiem: ${count}.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Pokazuje ${count} pierwszych znacznik\xF3w.`,"showingFirst"),totalTags:__name(({count})=>`Znalezionych wszystkich znacznik\xF3w: ${count}.`,"totalTags")}}};var cs_CZ_default={propertyDefaults:{title:"Bez n\xE1zvu",description:"Nebyl uveden \u017E\xE1dn\xFD popis"},components:{callout:{note:"Pozn\xE1mka",abstract:"Abstract",info:"Info",todo:"Todo",tip:"Tip",success:"\xDAsp\u011Bch",question:"Ot\xE1zka",warning:"Upozorn\u011Bn\xED",failure:"Chyba",danger:"Nebezpe\u010D\xED",bug:"Bug",example:"P\u0159\xEDklad",quote:"Citace"},backlinks:{title:"P\u0159\xEDchoz\xED odkazy",noBacklinksFound:"Nenalezeny \u017E\xE1dn\xE9 p\u0159\xEDchoz\xED odkazy"},themeToggle:{lightMode:"Sv\u011Btl\xFD re\u017Eim",darkMode:"Tmav\xFD re\u017Eim"},readerMode:{title:"Re\u017Eim \u010Dte\u010Dky"},explorer:{title:"Proch\xE1zet"},footer:{createdWith:"Vytvo\u0159eno pomoc\xED"},graph:{title:"Graf"},recentNotes:{title:"Nejnov\u011Bj\u0161\xED pozn\xE1mky",seeRemainingMore:__name(({remaining})=>`Zobraz ${remaining} dal\u0161\xEDch \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Zobrazen\xED ${targetSlug}`,"transcludeOf"),linkToOriginal:"Odkaz na p\u016Fvodn\xED dokument"},search:{title:"Hledat",searchBarPlaceholder:"Hledejte n\u011Bco"},tableOfContents:{title:"Obsah"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min \u010Dten\xED`,"readingTime")}},pages:{rss:{recentNotes:"Nejnov\u011Bj\u0161\xED pozn\xE1mky",lastFewNotes:__name(({count})=>`Posledn\xEDch ${count} pozn\xE1mek`,"lastFewNotes")},error:{title:"Nenalezeno",notFound:"Tato str\xE1nka je bu\u010F soukrom\xE1, nebo neexistuje.",home:"N\xE1vrat na domovskou str\xE1nku"},folderContent:{folder:"Slo\u017Eka",itemsUnderFolder:__name(({count})=>count===1?"1 polo\u017Eka v t\xE9to slo\u017Ece.":`${count} polo\u017Eek v t\xE9to slo\u017Ece.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Rejst\u0159\xEDk tag\u016F",itemsUnderTag:__name(({count})=>count===1?"1 polo\u017Eka s t\xEDmto tagem.":`${count} polo\u017Eek s t\xEDmto tagem.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Zobrazuj\xED se prvn\xED ${count} tagy.`,"showingFirst"),totalTags:__name(({count})=>`Nalezeno celkem ${count} tag\u016F.`,"totalTags")}}};var tr_TR_default={propertyDefaults:{title:"\u0130simsiz",description:"Herhangi bir a\xE7\u0131klama eklenmedi"},components:{callout:{note:"Not",abstract:"\xD6zet",info:"Bilgi",todo:"Yap\u0131lacaklar",tip:"\u0130pucu",success:"Ba\u015Far\u0131l\u0131",question:"Soru",warning:"Uyar\u0131",failure:"Ba\u015Far\u0131s\u0131z",danger:"Tehlike",bug:"Hata",example:"\xD6rnek",quote:"Al\u0131nt\u0131"},backlinks:{title:"Backlinkler",noBacklinksFound:"Backlink bulunamad\u0131"},themeToggle:{lightMode:"A\xE7\u0131k mod",darkMode:"Koyu mod"},readerMode:{title:"Okuma modu"},explorer:{title:"Gezgin"},footer:{createdWith:"\u015Eununla olu\u015Fturuldu"},graph:{title:"Grafik G\xF6r\xFCn\xFCm\xFC"},recentNotes:{title:"Son Notlar",seeRemainingMore:__name(({remaining})=>`${remaining} tane daha g\xF6r \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug} sayfas\u0131ndan al\u0131nt\u0131`,"transcludeOf"),linkToOriginal:"Orijinal ba\u011Flant\u0131"},search:{title:"Arama",searchBarPlaceholder:"Bir \u015Fey aray\u0131n"},tableOfContents:{title:"\u0130\xE7indekiler"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} dakika okuma s\xFCresi`,"readingTime")}},pages:{rss:{recentNotes:"Son notlar",lastFewNotes:__name(({count})=>`Son ${count} not`,"lastFewNotes")},error:{title:"Bulunamad\u0131",notFound:"Bu sayfa ya \xF6zel ya da mevcut de\u011Fil.",home:"Anasayfaya geri d\xF6n"},folderContent:{folder:"Klas\xF6r",itemsUnderFolder:__name(({count})=>count===1?"Bu klas\xF6r alt\u0131nda 1 \xF6\u011Fe.":`Bu klas\xF6r alt\u0131ndaki ${count} \xF6\u011Fe.`,"itemsUnderFolder")},tagContent:{tag:"Etiket",tagIndex:"Etiket S\u0131ras\u0131",itemsUnderTag:__name(({count})=>count===1?"Bu etikete sahip 1 \xF6\u011Fe.":`Bu etiket alt\u0131ndaki ${count} \xF6\u011Fe.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0130lk ${count} etiket g\xF6steriliyor.`,"showingFirst"),totalTags:__name(({count})=>`Toplam ${count} adet etiket bulundu.`,"totalTags")}}};var th_TH_default={propertyDefaults:{title:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E0A\u0E37\u0E48\u0E2D",description:"\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E30\u0E1A\u0E38\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E22\u0E48\u0E2D"},components:{callout:{note:"\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38",abstract:"\u0E1A\u0E17\u0E04\u0E31\u0E14\u0E22\u0E48\u0E2D",info:"\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",todo:"\u0E15\u0E49\u0E2D\u0E07\u0E17\u0E33\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21",tip:"\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33",success:"\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22",question:"\u0E04\u0E33\u0E16\u0E32\u0E21",warning:"\u0E04\u0E33\u0E40\u0E15\u0E37\u0E2D\u0E19",failure:"\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14",danger:"\u0E2D\u0E31\u0E19\u0E15\u0E23\u0E32\u0E22",bug:"\u0E1A\u0E31\u0E4A\u0E01",example:"\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07",quote:"\u0E04\u0E33\u0E1E\u0E39\u0E01\u0E22\u0E01\u0E21\u0E32"},backlinks:{title:"\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E01\u0E25\u0E48\u0E32\u0E27\u0E16\u0E36\u0E07",noBacklinksFound:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E42\u0E22\u0E07\u0E21\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49"},themeToggle:{lightMode:"\u0E42\u0E2B\u0E21\u0E14\u0E2A\u0E27\u0E48\u0E32\u0E07",darkMode:"\u0E42\u0E2B\u0E21\u0E14\u0E21\u0E37\u0E14"},readerMode:{title:"\u0E42\u0E2B\u0E21\u0E14\u0E2D\u0E48\u0E32\u0E19"},explorer:{title:"\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32"},footer:{createdWith:"\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E14\u0E49\u0E27\u0E22"},graph:{title:"\u0E21\u0E38\u0E21\u0E21\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F"},recentNotes:{title:"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14",seeRemainingMore:__name(({remaining})=>`\u0E14\u0E39\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2D\u0E35\u0E01 ${remaining} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0E23\u0E27\u0E21\u0E02\u0E49\u0E32\u0E21\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32\u0E08\u0E32\u0E01 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0E14\u0E39\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07"},search:{title:"\u0E04\u0E49\u0E19\u0E2B\u0E32",searchBarPlaceholder:"\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E1A\u0E32\u0E07\u0E2D\u0E22\u0E48\u0E32\u0E07"},tableOfContents:{title:"\u0E2A\u0E32\u0E23\u0E1A\u0E31\u0E0D"},contentMeta:{readingTime:__name(({minutes})=>`\u0E2D\u0E48\u0E32\u0E19\u0E23\u0E32\u0E27 ${minutes} \u0E19\u0E32\u0E17\u0E35`,"readingTime")}},pages:{rss:{recentNotes:"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14",lastFewNotes:__name(({count})=>`${count} \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14`,"lastFewNotes")},error:{title:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49",notFound:"\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49\u0E2D\u0E32\u0E08\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E2A\u0E23\u0E49\u0E32\u0E07",home:"\u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01"},folderContent:{folder:"\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C",itemsUnderFolder:__name(({count})=>`\u0E21\u0E35 ${count} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C\u0E19\u0E35\u0E49`,"itemsUnderFolder")},tagContent:{tag:"\u0E41\u0E17\u0E47\u0E01",tagIndex:"\u0E41\u0E17\u0E47\u0E01\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",itemsUnderTag:__name(({count})=>`\u0E21\u0E35 ${count} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E41\u0E17\u0E47\u0E01\u0E19\u0E35\u0E49`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0E41\u0E2A\u0E14\u0E07 ${count} \u0E41\u0E17\u0E47\u0E01\u0E41\u0E23\u0E01`,"showingFirst"),totalTags:__name(({count})=>`\u0E21\u0E35\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 ${count} \u0E41\u0E17\u0E47\u0E01`,"totalTags")}}};var lt_LT_default={propertyDefaults:{title:"Be Pavadinimo",description:"Apra\u0161ymas Nepateiktas"},components:{callout:{note:"Pastaba",abstract:"Santrauka",info:"Informacija",todo:"Darb\u0173 s\u0105ra\u0161as",tip:"Patarimas",success:"S\u0117kmingas",question:"Klausimas",warning:"\u012Esp\u0117jimas",failure:"Nes\u0117kmingas",danger:"Pavojus",bug:"Klaida",example:"Pavyzdys",quote:"Citata"},backlinks:{title:"Atgalin\u0117s Nuorodos",noBacklinksFound:"Atgalini\u0173 Nuorod\u0173 Nerasta"},themeToggle:{lightMode:"\u0160viesus Re\u017Eimas",darkMode:"Tamsus Re\u017Eimas"},readerMode:{title:"Modalit\xE0 lettore"},explorer:{title:"Nar\u0161ykl\u0117"},footer:{createdWith:"Sukurta Su"},graph:{title:"Grafiko Vaizdas"},recentNotes:{title:"Naujausi U\u017Era\u0161ai",seeRemainingMore:__name(({remaining})=>`Per\u017Ei\u016Br\u0117ti dar ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u012Eterpimas i\u0161 ${targetSlug}`,"transcludeOf"),linkToOriginal:"Nuoroda \u012F original\u0105"},search:{title:"Paie\u0161ka",searchBarPlaceholder:"Ie\u0161koti"},tableOfContents:{title:"Turinys"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min skaitymo`,"readingTime")}},pages:{rss:{recentNotes:"Naujausi u\u017Era\u0161ai",lastFewNotes:__name(({count})=>count===1?"Paskutinis 1 u\u017Era\u0161as":count<10?`Paskutiniai ${count} u\u017Era\u0161ai`:`Paskutiniai ${count} u\u017Era\u0161\u0173`,"lastFewNotes")},error:{title:"Nerasta",notFound:"Arba \u0161is puslapis yra pasiekiamas tik tam tikriems vartotojams, arba tokio puslapio n\u0117ra.",home:"Gr\u012F\u017Eti \u012F pagrindin\u012F puslap\u012F"},folderContent:{folder:"Aplankas",itemsUnderFolder:__name(({count})=>count===1?"1 elementas \u0161iame aplanke.":count<10?`${count} elementai \u0161iame aplanke.`:`${count} element\u0173 \u0161iame aplanke.`,"itemsUnderFolder")},tagContent:{tag:"\u017Dyma",tagIndex:"\u017Dym\u0173 indeksas",itemsUnderTag:__name(({count})=>count===1?"1 elementas su \u0161ia \u017Eyma.":count<10?`${count} elementai su \u0161ia \u017Eyma.`:`${count} element\u0173 su \u0161ia \u017Eyma.`,"itemsUnderTag"),showingFirst:__name(({count})=>count<10?`Rodomos pirmosios ${count} \u017Eymos.`:`Rodomos pirmosios ${count} \u017Eym\u0173.`,"showingFirst"),totalTags:__name(({count})=>count===1?"Rasta i\u0161 viso 1 \u017Eyma.":count<10?`Rasta i\u0161 viso ${count} \u017Eymos.`:`Rasta i\u0161 viso ${count} \u017Eym\u0173.`,"totalTags")}}};var fi_FI_default={propertyDefaults:{title:"Nimet\xF6n",description:"Ei kuvausta saatavilla"},components:{callout:{note:"Merkint\xE4",abstract:"Tiivistelm\xE4",info:"Info",todo:"Teht\xE4v\xE4lista",tip:"Vinkki",success:"Onnistuminen",question:"Kysymys",warning:"Varoitus",failure:"Ep\xE4onnistuminen",danger:"Vaara",bug:"Virhe",example:"Esimerkki",quote:"Lainaus"},backlinks:{title:"Takalinkit",noBacklinksFound:"Takalinkkej\xE4 ei l\xF6ytynyt"},themeToggle:{lightMode:"Vaalea tila",darkMode:"Tumma tila"},readerMode:{title:"Lukijatila"},explorer:{title:"Selain"},footer:{createdWith:"Luotu k\xE4ytt\xE4en"},graph:{title:"Verkkon\xE4kym\xE4"},recentNotes:{title:"Viimeisimm\xE4t muistiinpanot",seeRemainingMore:__name(({remaining})=>`N\xE4yt\xE4 ${remaining} lis\xE4\xE4 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Upote kohteesta ${targetSlug}`,"transcludeOf"),linkToOriginal:"Linkki alkuper\xE4iseen"},search:{title:"Haku",searchBarPlaceholder:"Hae jotain"},tableOfContents:{title:"Sis\xE4llysluettelo"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min lukuaika`,"readingTime")}},pages:{rss:{recentNotes:"Viimeisimm\xE4t muistiinpanot",lastFewNotes:__name(({count})=>`Viimeiset ${count} muistiinpanoa`,"lastFewNotes")},error:{title:"Ei l\xF6ytynyt",notFound:"T\xE4m\xE4 sivu on joko yksityinen tai sit\xE4 ei ole olemassa.",home:"Palaa etusivulle"},folderContent:{folder:"Kansio",itemsUnderFolder:__name(({count})=>count===1?"1 kohde t\xE4ss\xE4 kansiossa.":`${count} kohdetta t\xE4ss\xE4 kansiossa.`,"itemsUnderFolder")},tagContent:{tag:"Tunniste",tagIndex:"Tunnisteluettelo",itemsUnderTag:__name(({count})=>count===1?"1 kohde t\xE4ll\xE4 tunnisteella.":`${count} kohdetta t\xE4ll\xE4 tunnisteella.`,"itemsUnderTag"),showingFirst:__name(({count})=>`N\xE4ytet\xE4\xE4n ensimm\xE4iset ${count} tunnistetta.`,"showingFirst"),totalTags:__name(({count})=>`L\xF6ytyi yhteens\xE4 ${count} tunnistetta.`,"totalTags")}}};var nb_NO_default={propertyDefaults:{title:"Uten navn",description:"Ingen beskrivelse angitt"},components:{callout:{note:"Notis",abstract:"Abstrakt",info:"Info",todo:"Husk p\xE5",tip:"Tips",success:"Suksess",question:"Sp\xF8rsm\xE5l",warning:"Advarsel",failure:"Feil",danger:"Farlig",bug:"Bug",example:"Eksempel",quote:"Sitat"},backlinks:{title:"Tilbakekoblinger",noBacklinksFound:"Ingen tilbakekoblinger funnet"},themeToggle:{lightMode:"Lys modus",darkMode:"M\xF8rk modus"},readerMode:{title:"L\xE6semodus"},explorer:{title:"Utforsker"},footer:{createdWith:"Laget med"},graph:{title:"Graf-visning"},recentNotes:{title:"Nylige notater",seeRemainingMore:__name(({remaining})=>`Se ${remaining} til \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transkludering of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Lenke til original"},search:{title:"S\xF8k",searchBarPlaceholder:"S\xF8k etter noe"},tableOfContents:{title:"Oversikt"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min lesning`,"readingTime")}},pages:{rss:{recentNotes:"Nylige notat",lastFewNotes:__name(({count})=>`Siste ${count} notat`,"lastFewNotes")},error:{title:"Ikke funnet",notFound:"Enten er denne siden privat eller s\xE5 finnes den ikke.",home:"Returner til hovedsiden"},folderContent:{folder:"Mappe",itemsUnderFolder:__name(({count})=>count===1?"1 gjenstand i denne mappen.":`${count} gjenstander i denne mappen.`,"itemsUnderFolder")},tagContent:{tag:"Tagg",tagIndex:"Tagg Indeks",itemsUnderTag:__name(({count})=>count===1?"1 gjenstand med denne taggen.":`${count} gjenstander med denne taggen.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Viser f\xF8rste ${count} tagger.`,"showingFirst"),totalTags:__name(({count})=>`Fant totalt ${count} tagger.`,"totalTags")}}};var TRANSLATIONS={"en-US":en_US_default,"en-GB":en_GB_default,"fr-FR":fr_FR_default,"it-IT":it_IT_default,"ja-JP":ja_JP_default,"de-DE":de_DE_default,"nl-NL":nl_NL_default,"nl-BE":nl_NL_default,"ro-RO":ro_RO_default,"ro-MD":ro_RO_default,"ca-ES":ca_ES_default,"es-ES":es_ES_default,"ar-SA":ar_SA_default,"ar-AE":ar_SA_default,"ar-QA":ar_SA_default,"ar-BH":ar_SA_default,"ar-KW":ar_SA_default,"ar-OM":ar_SA_default,"ar-YE":ar_SA_default,"ar-IR":ar_SA_default,"ar-SY":ar_SA_default,"ar-IQ":ar_SA_default,"ar-JO":ar_SA_default,"ar-PL":ar_SA_default,"ar-LB":ar_SA_default,"ar-EG":ar_SA_default,"ar-SD":ar_SA_default,"ar-LY":ar_SA_default,"ar-MA":ar_SA_default,"ar-TN":ar_SA_default,"ar-DZ":ar_SA_default,"ar-MR":ar_SA_default,"uk-UA":uk_UA_default,"ru-RU":ru_RU_default,"ko-KR":ko_KR_default,"zh-CN":zh_CN_default,"zh-TW":zh_TW_default,"vi-VN":vi_VN_default,"pt-BR":pt_BR_default,"hu-HU":hu_HU_default,"fa-IR":fa_IR_default,"pl-PL":pl_PL_default,"cs-CZ":cs_CZ_default,"tr-TR":tr_TR_default,"th-TH":th_TH_default,"lt-LT":lt_LT_default,"fi-FI":fi_FI_default,"nb-NO":nb_NO_default},defaultTranslation="en-US",i18n=__name(locale=>TRANSLATIONS[locale??defaultTranslation],"i18n");var defaultOptions={delimiters:"---",language:"yaml"};function coalesceAliases(data,aliases){for(let alias of aliases)if(data[alias]!==void 0&&data[alias]!==null)return data[alias]}__name(coalesceAliases,"coalesceAliases");function coerceToArray(input){if(input!=null)return Array.isArray(input)||(input=input.toString().split(",").map(tag=>tag.trim())),input.filter(tag=>typeof tag=="string"||typeof tag=="number").map(tag=>tag.toString())}__name(coerceToArray,"coerceToArray");function getAliasSlugs(aliases){let res=[];for(let alias of aliases){let mockFp=getFileExtension(alias)==="md"?alias:alias+".md",slug=slugifyFilePath(mockFp);res.push(slug)}return res}__name(getAliasSlugs,"getAliasSlugs");var FrontMatter=__name(userOpts=>{let opts={...defaultOptions,...userOpts};return{name:"FrontMatter",markdownPlugins(ctx){let{cfg,allSlugs}=ctx;return[[remarkFrontmatter,["yaml","toml"]],()=>(_,file)=>{let fileData=Buffer.from(file.value),{data}=matter(fileData,{...opts,engines:{yaml:__name(s=>yaml.load(s,{schema:yaml.JSON_SCHEMA}),"yaml"),toml:__name(s=>toml.parse(s),"toml")}});data.title!=null&&data.title.toString()!==""?data.title=data.title.toString():data.title=file.stem??i18n(cfg.configuration.locale).propertyDefaults.title;let tags=coerceToArray(coalesceAliases(data,["tags","tag"]));tags&&(data.tags=[...new Set(tags.map(tag=>slugTag(tag)))]);let aliases=coerceToArray(coalesceAliases(data,["aliases","alias"]));if(aliases&&(data.aliases=aliases,file.data.aliases=getAliasSlugs(aliases),allSlugs.push(...file.data.aliases)),data.permalink!=null&&data.permalink.toString()!==""){data.permalink=data.permalink.toString();let aliases2=file.data.aliases??[];aliases2.push(data.permalink),file.data.aliases=aliases2,allSlugs.push(data.permalink)}let cssclasses=coerceToArray(coalesceAliases(data,["cssclasses","cssclass"]));cssclasses&&(data.cssclasses=cssclasses);let socialImage=coalesceAliases(data,["socialImage","image","cover"]),created=coalesceAliases(data,["created","date"]);created&&(data.created=created);let modified=coalesceAliases(data,["modified","lastmod","updated","last-modified"]);modified&&(data.modified=modified);let published=coalesceAliases(data,["published","publishDate","date"]);published&&(data.published=published),socialImage&&(data.socialImage=socialImage);let uniqueSlugs=[...new Set(allSlugs)];allSlugs.splice(0,allSlugs.length,...uniqueSlugs),file.data.frontmatter=data}]}}},"FrontMatter");import remarkGfm from"remark-gfm";import smartypants from"remark-smartypants";import rehypeSlug from"rehype-slug";import rehypeAutolinkHeadings from"rehype-autolink-headings";var defaultOptions2={enableSmartyPants:!0,linkHeadings:!0},GitHubFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions2,...userOpts};return{name:"GitHubFlavoredMarkdown",markdownPlugins(){return opts.enableSmartyPants?[remarkGfm,smartypants]:[remarkGfm]},htmlPlugins(){return opts.linkHeadings?[rehypeSlug,[rehypeAutolinkHeadings,{behavior:"append",properties:{role:"anchor",ariaHidden:!0,tabIndex:-1,"data-no-popover":!0},content:{type:"element",tagName:"svg",properties:{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},children:[{type:"element",tagName:"path",properties:{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"},children:[]},{type:"element",tagName:"path",properties:{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"},children:[]}]}}]]:[]}}},"GitHubFlavoredMarkdown");import rehypeCitation from"rehype-citation";import{visit}from"unist-util-visit";import fs from"fs";import{Repository}from"@napi-rs/simple-git";import chalk4 from"chalk";import path2 from"path";var defaultOptions3={priority:["frontmatter","git","filesystem"]};function coerceDate(fp,d){let dt=new Date(d),invalidDate=isNaN(dt.getTime())||dt.getTime()===0;return invalidDate&&d!==void 0&&console.log(chalk4.yellow(`
Warning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`)),invalidDate?new Date:dt}__name(coerceDate,"coerceDate");var CreatedModifiedDate=__name(userOpts=>{let opts={...defaultOptions3,...userOpts};return{name:"CreatedModifiedDate",markdownPlugins(ctx){return[()=>{let repo,repositoryWorkdir;if(opts.priority.includes("git"))try{repo=Repository.discover(ctx.argv.directory),repositoryWorkdir=repo.workdir()??ctx.argv.directory}catch{console.log(chalk4.yellow(`
Warning: couldn't find git repository for ${ctx.argv.directory}`))}return async(_tree,file)=>{let created,modified,published,fp=file.data.relativePath,fullFp=file.data.filePath;for(let source of opts.priority)if(source==="filesystem"){let st=await fs.promises.stat(fullFp);created||=st.birthtimeMs,modified||=st.mtimeMs}else if(source==="frontmatter"&&file.data.frontmatter)created||=file.data.frontmatter.created,modified||=file.data.frontmatter.modified,published||=file.data.frontmatter.published;else if(source==="git"&&repo)try{let relativePath=path2.relative(repositoryWorkdir,fullFp);modified||=await repo.getFileLatestModifiedDateAsync(relativePath)}catch{console.log(chalk4.yellow(`
Warning: ${file.data.filePath} isn't yet tracked by git, dates will be inaccurate`))}file.data.dates={created:coerceDate(fp,created),modified:coerceDate(fp,modified),published:coerceDate(fp,published)}}}]}}},"CreatedModifiedDate");import remarkMath from"remark-math";import rehypeKatex from"rehype-katex";import rehypeMathjax from"rehype-mathjax/svg";import rehypeTypst from"@myriaddreamin/rehype-typst";var Latex=__name(opts=>{let engine=opts?.renderEngine??"katex",macros=opts?.customMacros??{};return{name:"Latex",markdownPlugins(){return[remarkMath]},htmlPlugins(){switch(engine){case"katex":return[[rehypeKatex,{output:"html",macros,...opts?.katexOptions??{}}]];case"typst":return[[rehypeTypst,opts?.typstOptions??{}]];case"mathjax":return[[rehypeMathjax,{macros,...opts?.mathJaxOptions??{}}]];default:return[[rehypeMathjax,{macros,...opts?.mathJaxOptions??{}}]]}},externalResources(){switch(engine){case"katex":return{css:[{content:"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"}],js:[{src:"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",loadTime:"afterDOMReady",contentType:"external"}]}}}}},"Latex");import{toString}from"hast-util-to-string";var escapeHTML=__name(unsafe=>unsafe.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),"escapeHTML"),unescapeHTML=__name(html=>html.replaceAll("&amp;","&").replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&quot;",'"').replaceAll("&#039;","'"),"unescapeHTML");var defaultOptions4={descriptionLength:150,maxDescriptionLength:300,replaceExternalLinks:!0},urlRegex=new RegExp(/(https?:\/\/)?(?<domain>([\da-z\.-]+)\.([a-z\.]{2,6})(:\d+)?)(?<path>[\/\w\.-]*)(\?[\/\w\.=&;-]*)?/,"g"),Description=__name(userOpts=>{let opts={...defaultOptions4,...userOpts};return{name:"Description",htmlPlugins(){return[()=>async(tree,file)=>{let frontMatterDescription=file.data.frontmatter?.description,text=escapeHTML(toString(tree));if(opts.replaceExternalLinks&&(frontMatterDescription=frontMatterDescription?.replace(urlRegex,"$<domain>$<path>"),text=text.replace(urlRegex,"$<domain>$<path>")),frontMatterDescription){file.data.description=frontMatterDescription,file.data.text=text;return}let sentences=text.replace(/\s+/g," ").split(/\.\s/),finalDesc="",sentenceIdx=0;for(;sentenceIdx<sentences.length;){let sentence=sentences[sentenceIdx];if(!sentence)break;let currentSentence=sentence.endsWith(".")?sentence:sentence+".";if(finalDesc.length+currentSentence.length+(finalDesc?1:0)<=opts.descriptionLength||sentenceIdx===0)finalDesc+=(finalDesc?" ":"")+currentSentence,sentenceIdx++;else break}file.data.description=finalDesc.length>opts.maxDescriptionLength?finalDesc.slice(0,opts.maxDescriptionLength)+"...":finalDesc,file.data.text=text}]}}},"Description");import path3 from"path";import{visit as visit2}from"unist-util-visit";import isAbsoluteUrl from"is-absolute-url";var defaultOptions5={markdownLinkResolution:"absolute",prettyLinks:!0,openLinksInNewTab:!1,lazyLoad:!1,externalLinkIcon:!0},CrawlLinks=__name(userOpts=>{let opts={...defaultOptions5,...userOpts};return{name:"LinkProcessing",htmlPlugins(ctx){return[()=>(tree,file)=>{let curSlug=simplifySlug(file.data.slug),outgoing=new Set,transformOptions={strategy:opts.markdownLinkResolution,allSlugs:ctx.allSlugs};visit2(tree,"element",(node,_index,_parent)=>{if(node.tagName==="a"&&node.properties&&typeof node.properties.href=="string"){let dest=node.properties.href,classes=node.properties.className??[],isExternal=isAbsoluteUrl(dest);classes.push(isExternal?"external":"internal"),isExternal&&opts.externalLinkIcon&&node.children.push({type:"element",tagName:"svg",properties:{"aria-hidden":"true",class:"external-icon",style:"max-width:0.8em;max-height:0.8em",viewBox:"0 0 512 512"},children:[{type:"element",tagName:"path",properties:{d:"M320 0H288V64h32 82.7L201.4 265.4 178.7 288 224 333.3l22.6-22.6L448 109.3V192v32h64V192 32 0H480 320zM32 32H0V64 480v32H32 456h32V480 352 320H424v32 96H64V96h96 32V32H160 32z"},children:[]}]}),node.children.length===1&&node.children[0].type==="text"&&node.children[0].value!==dest&&classes.push("alias"),node.properties.className=classes,isExternal&&opts.openLinksInNewTab&&(node.properties.target="_blank");let isInternal=!(isAbsoluteUrl(dest)||dest.startsWith("#"));if(isInternal){dest=node.properties.href=transformLink(file.data.slug,dest,transformOptions);let canonicalDest=new URL(dest,"https://base.com/"+stripSlashes(curSlug,!0)).pathname,[destCanonical,_destAnchor]=splitAnchor(canonicalDest);destCanonical.endsWith("/")&&(destCanonical+="index");let full=decodeURIComponent(stripSlashes(destCanonical,!0)),simple=simplifySlug(full);outgoing.add(simple),node.properties["data-slug"]=full}opts.prettyLinks&&isInternal&&node.children.length===1&&node.children[0].type==="text"&&!node.children[0].value.startsWith("#")&&(node.children[0].value=path3.basename(node.children[0].value))}if(["img","video","audio","iframe"].includes(node.tagName)&&node.properties&&typeof node.properties.src=="string"&&(opts.lazyLoad&&(node.properties.loading="lazy"),!isAbsoluteUrl(node.properties.src))){let dest=node.properties.src;dest=node.properties.src=transformLink(file.data.slug,dest,transformOptions),node.properties.src=dest}}),file.data.links=[...outgoing]}]}}},"CrawlLinks");import{findAndReplace as mdastFindReplace}from"mdast-util-find-and-replace";import rehypeRaw from"rehype-raw";import{SKIP,visit as visit3}from"unist-util-visit";import path4 from"path";var callout_inline_default=`function n(){let t=this.parentElement;t.classList.toggle("is-collapsed");let e=t.getElementsByClassName("callout-content")[0];if(!e)return;let l=t.classList.contains("is-collapsed");e.style.gridTemplateRows=l?"0fr":"1fr"}function c(){let t=document.getElementsByClassName("callout is-collapsible");for(let e of t){let l=e.getElementsByClassName("callout-title")[0],s=e.getElementsByClassName("callout-content")[0];if(!l||!s)continue;l.addEventListener("click",n),window.addCleanup(()=>l.removeEventListener("click",n));let o=e.classList.contains("is-collapsed");s.style.gridTemplateRows=o?"0fr":"1fr"}}document.addEventListener("nav",c);
`;var checkbox_inline_default='var m=Object.create;var f=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var y=Object.getPrototypeOf,b=Object.prototype.hasOwnProperty;var R=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var j=(t,e,n,E)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of S(e))!b.call(t,i)&&i!==n&&f(t,i,{get:()=>e[i],enumerable:!(E=x(e,i))||E.enumerable});return t};var w=(t,e,n)=>(n=t!=null?m(y(t)):{},j(e||!t||!t.__esModule?f(n,"default",{value:t,enumerable:!0}):n,t));var p=R((I,g)=>{"use strict";g.exports=L;function B(t){return t instanceof Buffer?Buffer.from(t):new t.constructor(t.buffer.slice(),t.byteOffset,t.length)}function L(t){if(t=t||{},t.circles)return v(t);let e=new Map;if(e.set(Date,F=>new Date(F)),e.set(Map,(F,l)=>new Map(E(Array.from(F),l))),e.set(Set,(F,l)=>new Set(E(Array.from(F),l))),t.constructorHandlers)for(let F of t.constructorHandlers)e.set(F[0],F[1]);let n=null;return t.proto?o:i;function E(F,l){let u=Object.keys(F),D=new Array(u.length);for(let s=0;s<u.length;s++){let r=u[s],A=F[r];typeof A!="object"||A===null?D[r]=A:A.constructor!==Object&&(n=e.get(A.constructor))?D[r]=n(A,l):ArrayBuffer.isView(A)?D[r]=B(A):D[r]=l(A)}return D}function i(F){if(typeof F!="object"||F===null)return F;if(Array.isArray(F))return E(F,i);if(F.constructor!==Object&&(n=e.get(F.constructor)))return n(F,i);let l={};for(let u in F){if(Object.hasOwnProperty.call(F,u)===!1)continue;let D=F[u];typeof D!="object"||D===null?l[u]=D:D.constructor!==Object&&(n=e.get(D.constructor))?l[u]=n(D,i):ArrayBuffer.isView(D)?l[u]=B(D):l[u]=i(D)}return l}function o(F){if(typeof F!="object"||F===null)return F;if(Array.isArray(F))return E(F,o);if(F.constructor!==Object&&(n=e.get(F.constructor)))return n(F,o);let l={};for(let u in F){let D=F[u];typeof D!="object"||D===null?l[u]=D:D.constructor!==Object&&(n=e.get(D.constructor))?l[u]=n(D,o):ArrayBuffer.isView(D)?l[u]=B(D):l[u]=o(D)}return l}}function v(t){let e=[],n=[],E=new Map;if(E.set(Date,u=>new Date(u)),E.set(Map,(u,D)=>new Map(o(Array.from(u),D))),E.set(Set,(u,D)=>new Set(o(Array.from(u),D))),t.constructorHandlers)for(let u of t.constructorHandlers)E.set(u[0],u[1]);let i=null;return t.proto?l:F;function o(u,D){let s=Object.keys(u),r=new Array(s.length);for(let A=0;A<s.length;A++){let c=s[A],C=u[c];if(typeof C!="object"||C===null)r[c]=C;else if(C.constructor!==Object&&(i=E.get(C.constructor)))r[c]=i(C,D);else if(ArrayBuffer.isView(C))r[c]=B(C);else{let a=e.indexOf(C);a!==-1?r[c]=n[a]:r[c]=D(C)}}return r}function F(u){if(typeof u!="object"||u===null)return u;if(Array.isArray(u))return o(u,F);if(u.constructor!==Object&&(i=E.get(u.constructor)))return i(u,F);let D={};e.push(u),n.push(D);for(let s in u){if(Object.hasOwnProperty.call(u,s)===!1)continue;let r=u[s];if(typeof r!="object"||r===null)D[s]=r;else if(r.constructor!==Object&&(i=E.get(r.constructor)))D[s]=i(r,F);else if(ArrayBuffer.isView(r))D[s]=B(r);else{let A=e.indexOf(r);A!==-1?D[s]=n[A]:D[s]=F(r)}}return e.pop(),n.pop(),D}function l(u){if(typeof u!="object"||u===null)return u;if(Array.isArray(u))return o(u,l);if(u.constructor!==Object&&(i=E.get(u.constructor)))return i(u,l);let D={};e.push(u),n.push(D);for(let s in u){let r=u[s];if(typeof r!="object"||r===null)D[s]=r;else if(r.constructor!==Object&&(i=E.get(r.constructor)))D[s]=i(r,l);else if(ArrayBuffer.isView(r))D[s]=B(r);else{let A=e.indexOf(r);A!==-1?D[s]=n[A]:D[s]=l(r)}}return e.pop(),n.pop(),D}}});var T=Object.hasOwnProperty;var h=w(p(),1),O=(0,h.default)();function d(t){return t.document.body.dataset.slug}var k=t=>`${d(window)}-checkbox-${t}`;document.addEventListener("nav",()=>{document.querySelectorAll("input.checkbox-toggle").forEach((e,n)=>{let E=k(n),i=o=>{let F=o.target?.checked?"true":"false";localStorage.setItem(E,F)};e.addEventListener("change",i),window.addCleanup(()=>e.removeEventListener("change",i)),localStorage.getItem(E)==="true"&&(e.checked=!0)})});\n';var mermaid_inline_default='function f(i,e){if(!i)return;function r(o){o.target===this&&(o.preventDefault(),o.stopPropagation(),e())}function t(o){o.key.startsWith("Esc")&&(o.preventDefault(),e())}i?.addEventListener("click",r),window.addCleanup(()=>i?.removeEventListener("click",r)),document.addEventListener("keydown",t),window.addCleanup(()=>document.removeEventListener("keydown",t))}function y(i){for(;i.firstChild;)i.removeChild(i.firstChild)}var h=class{constructor(e,r){this.container=e;this.content=r;this.setupEventListeners(),this.setupNavigationControls(),this.resetTransform()}isDragging=!1;startPan={x:0,y:0};currentPan={x:0,y:0};scale=1;MIN_SCALE=.5;MAX_SCALE=3;cleanups=[];setupEventListeners(){let e=this.onMouseDown.bind(this),r=this.onMouseMove.bind(this),t=this.onMouseUp.bind(this),o=this.resetTransform.bind(this);this.container.addEventListener("mousedown",e),document.addEventListener("mousemove",r),document.addEventListener("mouseup",t),window.addEventListener("resize",o),this.cleanups.push(()=>this.container.removeEventListener("mousedown",e),()=>document.removeEventListener("mousemove",r),()=>document.removeEventListener("mouseup",t),()=>window.removeEventListener("resize",o))}cleanup(){for(let e of this.cleanups)e()}setupNavigationControls(){let e=document.createElement("div");e.className="mermaid-controls";let r=this.createButton("+",()=>this.zoom(.1)),t=this.createButton("-",()=>this.zoom(-.1)),o=this.createButton("Reset",()=>this.resetTransform());e.appendChild(t),e.appendChild(o),e.appendChild(r),this.container.appendChild(e)}createButton(e,r){let t=document.createElement("button");return t.textContent=e,t.className="mermaid-control-button",t.addEventListener("click",r),window.addCleanup(()=>t.removeEventListener("click",r)),t}onMouseDown(e){e.button===0&&(this.isDragging=!0,this.startPan={x:e.clientX-this.currentPan.x,y:e.clientY-this.currentPan.y},this.container.style.cursor="grabbing")}onMouseMove(e){this.isDragging&&(e.preventDefault(),this.currentPan={x:e.clientX-this.startPan.x,y:e.clientY-this.startPan.y},this.updateTransform())}onMouseUp(){this.isDragging=!1,this.container.style.cursor="grab"}zoom(e){let r=Math.min(Math.max(this.scale+e,this.MIN_SCALE),this.MAX_SCALE),t=this.content.getBoundingClientRect(),o=t.width/2,n=t.height/2,c=r-this.scale;this.currentPan.x-=o*c,this.currentPan.y-=n*c,this.scale=r,this.updateTransform()}updateTransform(){this.content.style.transform=`translate(${this.currentPan.x}px, ${this.currentPan.y}px) scale(${this.scale})`}resetTransform(){this.scale=1;let e=this.content.querySelector("svg");this.currentPan={x:e.getBoundingClientRect().width/2,y:e.getBoundingClientRect().height/2},this.updateTransform()}},C=["--secondary","--tertiary","--gray","--light","--lightgray","--highlight","--dark","--darkgray","--codeFont"],E;document.addEventListener("nav",async()=>{let e=document.querySelector(".center").querySelectorAll("code.mermaid");if(e.length===0)return;E||=await import("https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs");let r=E.default,t=new WeakMap;for(let n of e)t.set(n,n.innerText);async function o(){for(let s of e){s.removeAttribute("data-processed");let a=t.get(s);a&&(s.innerHTML=a)}let n=C.reduce((s,a)=>(s[a]=window.getComputedStyle(document.documentElement).getPropertyValue(a),s),{}),c=document.documentElement.getAttribute("saved-theme")==="dark";r.initialize({startOnLoad:!1,securityLevel:"loose",theme:c?"dark":"base",themeVariables:{fontFamily:n["--codeFont"],primaryColor:n["--light"],primaryTextColor:n["--darkgray"],primaryBorderColor:n["--tertiary"],lineColor:n["--darkgray"],secondaryColor:n["--secondary"],tertiaryColor:n["--tertiary"],clusterBkg:n["--light"],edgeLabelBackground:n["--highlight"]}}),await r.run({nodes:e})}await o(),document.addEventListener("themechange",o),window.addCleanup(()=>document.removeEventListener("themechange",o));for(let n=0;n<e.length;n++){let v=function(){let g=l.querySelector("#mermaid-space"),m=l.querySelector(".mermaid-content");if(!m)return;y(m);let w=c.querySelector("svg").cloneNode(!0);m.appendChild(w),l.classList.add("active"),g.style.cursor="grab",u=new h(g,m)},M=function(){l.classList.remove("active"),u?.cleanup(),u=null},c=e[n],s=c.parentElement,a=s.querySelector(".clipboard-button"),d=s.querySelector(".expand-button"),p=window.getComputedStyle(a),L=a.offsetWidth+parseFloat(p.marginLeft||"0")+parseFloat(p.marginRight||"0");d.style.right=`calc(${L}px + 0.3rem)`,s.prepend(d);let l=s.querySelector("#mermaid-container");if(!l)return;let u=null;d.addEventListener("click",v),f(l,M),window.addCleanup(()=>{u?.cleanup(),d.removeEventListener("click",v)})}});\n';var mermaid_inline_default2=`.expand-button {
  position: absolute;
  display: flex;
  float: right;
  padding: 0.4rem;
  margin: 0.3rem;
  right: 0;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.expand-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.expand-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.expand-button:focus {
  outline: 0;
}

pre:hover > .expand-button {
  opacity: 1;
  transition: 0.2s;
}

#mermaid-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: none;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.5);
}
#mermaid-container.active {
  display: inline-block;
}
#mermaid-container > #mermaid-space {
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80vh;
  width: 80vw;
  overflow: hidden;
}
#mermaid-container > #mermaid-space > .mermaid-content {
  padding: 2rem;
  position: relative;
  transform-origin: 0 0;
  transition: transform 0.1s ease;
  overflow: visible;
  min-height: 200px;
  min-width: 200px;
}
#mermaid-container > #mermaid-space > .mermaid-content pre {
  margin: 0;
  border: none;
}
#mermaid-container > #mermaid-space > .mermaid-content svg {
  max-width: none;
  height: auto;
}
#mermaid-container > #mermaid-space > .mermaid-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  padding: 8px;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--dark);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-family: var(--bodyFont);
  transition: all 0.2s ease;
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:hover {
  background: var(--lightgray);
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:active {
  transform: translateY(1px);
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:nth-child(2) {
  width: auto;
  padding: 0 12px;
  font-size: 14px;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyJtZXJtYWlkLmlubGluZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFOzs7QUFLRjtFQUNFO0VBQ0E7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFOztBQUlGO0VBQ0U7RUFDQTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLmV4cGFuZC1idXR0b24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsb2F0OiByaWdodDtcbiAgcGFkZGluZzogMC40cmVtO1xuICBtYXJnaW46IDAuM3JlbTtcbiAgcmlnaHQ6IDA7IC8vIE5PVEU6IHJpZ2h0IHdpbGwgYmUgc2V0IGluIG1lcm1haWQuaW5saW5lLnRzXG4gIGNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICBib3JkZXI6IDFweCBzb2xpZDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiAwLjJzO1xuXG4gICYgPiBzdmcge1xuICAgIGZpbGw6IHZhcigtLWxpZ2h0KTtcbiAgICBmaWx0ZXI6IGNvbnRyYXN0KDAuMyk7XG4gIH1cblxuICAmOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICB9XG5cbiAgJjpmb2N1cyB7XG4gICAgb3V0bGluZTogMDtcbiAgfVxufVxuXG5wcmUge1xuICAmOmhvdmVyID4gLmV4cGFuZC1idXR0b24ge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNpdGlvbjogMC4ycztcbiAgfVxufVxuXG4jbWVybWFpZC1jb250YWluZXIge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGNvbnRhaW46IGxheW91dDtcbiAgei1pbmRleDogOTk5O1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHdpZHRoOiAxMDB2dztcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgZGlzcGxheTogbm9uZTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTtcblxuICAmLmFjdGl2ZSB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB9XG5cbiAgJiA+ICNtZXJtYWlkLXNwYWNlIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0KTtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogNTAlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgICBoZWlnaHQ6IDgwdmg7XG4gICAgd2lkdGg6IDgwdnc7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAgICYgPiAubWVybWFpZC1jb250ZW50IHtcbiAgICAgIHBhZGRpbmc6IDJyZW07XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwIDA7XG4gICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4xcyBlYXNlO1xuICAgICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gICAgICBtaW4taGVpZ2h0OiAyMDBweDtcbiAgICAgIG1pbi13aWR0aDogMjAwcHg7XG5cbiAgICAgIHByZSB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgfVxuXG4gICAgICBzdmcge1xuICAgICAgICBtYXgtd2lkdGg6IG5vbmU7XG4gICAgICAgIGhlaWdodDogYXV0bztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmID4gLm1lcm1haWQtY29udHJvbHMge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgYm90dG9tOiAyMHB4O1xuICAgICAgcmlnaHQ6IDIwcHg7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZ2FwOiA4cHg7XG4gICAgICBwYWRkaW5nOiA4cHg7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodCk7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xuICAgICAgYm94LXNoYWRvdzogMCAycHggNHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgICAgIHotaW5kZXg6IDI7XG5cbiAgICAgIC5tZXJtYWlkLWNvbnRyb2wtYnV0dG9uIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAzMnB4O1xuICAgICAgICBoZWlnaHQ6IDMycHg7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0KTtcbiAgICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBmb250LWZhbWlseTogdmFyKC0tYm9keUZvbnQpO1xuICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDFweCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdHlsZSB0aGUgcmVzZXQgYnV0dG9uIGRpZmZlcmVudGx5XG4gICAgICAgICY6bnRoLWNoaWxkKDIpIHtcbiAgICAgICAgICB3aWR0aDogYXV0bztcbiAgICAgICAgICBwYWRkaW5nOiAwIDEycHg7XG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0= */`;import{toHast}from"mdast-util-to-hast";import{toHtml}from"hast-util-to-html";function capitalize(s){return s.substring(0,1).toUpperCase()+s.substring(1)}__name(capitalize,"capitalize");function classNames(displayClass,...classes){return displayClass&&classes.push(displayClass),classes.join(" ")}__name(classNames,"classNames");var defaultOptions6={comments:!0,highlight:!0,wikilinks:!0,callouts:!0,mermaid:!0,parseTags:!0,parseArrows:!0,parseBlockReferences:!0,enableInHtmlEmbed:!1,enableYouTubeEmbed:!0,enableVideoEmbed:!0,enableCheckbox:!1},calloutMapping={note:"note",abstract:"abstract",summary:"abstract",tldr:"abstract",info:"info",todo:"todo",tip:"tip",hint:"tip",important:"tip",success:"success",check:"success",done:"success",question:"question",help:"question",faq:"question",warning:"warning",attention:"warning",caution:"warning",failure:"failure",missing:"failure",fail:"failure",danger:"danger",error:"danger",bug:"bug",example:"example",quote:"quote",cite:"quote"},arrowMapping={"->":"&rarr;","-->":"&rArr;","=>":"&rArr;","==>":"&rArr;","<-":"&larr;","<--":"&lArr;","<=":"&lArr;","<==":"&lArr;"};function canonicalizeCallout(calloutName){let normalizedCallout=calloutName.toLowerCase();return calloutMapping[normalizedCallout]??calloutName}__name(canonicalizeCallout,"canonicalizeCallout");var externalLinkRegex=/^https?:\/\//i,arrowRegex=new RegExp(/(-{1,2}>|={1,2}>|<-{1,2}|<={1,2})/g),wikilinkRegex=new RegExp(/!?\[\[([^\[\]\|\#\\]+)?(#+[^\[\]\|\#\\]+)?(\\?\|[^\[\]\#]*)?\]\]/g),tableRegex=new RegExp(/^\|([^\n])+\|\n(\|)( ?:?-{3,}:? ?\|)+\n(\|([^\n])+\|\n?)+/gm),tableWikilinkRegex=new RegExp(/(!?\[\[[^\]]*?\]\]|\[\^[^\]]*?\])/g),highlightRegex=new RegExp(/==([^=]+)==/g),commentRegex=new RegExp(/%%[\s\S]*?%%/g),calloutRegex=new RegExp(/^\[\!([\w-]+)\|?(.+?)?\]([+-]?)/),calloutLineRegex=new RegExp(/^> *\[\!\w+\|?.*?\][+-]?.*$/gm),tagRegex=new RegExp(/(?<=^| )#((?:[-_\p{L}\p{Emoji}\p{M}\d])+(?:\/[-_\p{L}\p{Emoji}\p{M}\d]+)*)/gu),blockReferenceRegex=new RegExp(/\^([-_A-Za-z0-9]+)$/g),ytLinkRegex=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,ytPlaylistLinkRegex=/[?&]list=([^#?&]*)/,videoExtensionRegex=new RegExp(/\.(mp4|webm|ogg|avi|mov|flv|wmv|mkv|mpg|mpeg|3gp|m4v)$/),wikilinkImageEmbedRegex=new RegExp(/^(?<alt>(?!^\d*x?\d*$).*?)?(\|?\s*?(?<width>\d+)(x(?<height>\d+))?)?$/),ObsidianFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions6,...userOpts},mdastToHtml=__name(ast=>{let hast=toHast(ast,{allowDangerousHtml:!0});return toHtml(hast,{allowDangerousHtml:!0})},"mdastToHtml");return{name:"ObsidianFlavoredMarkdown",textTransform(_ctx,src){return opts.comments&&(src=src.replace(commentRegex,"")),opts.callouts&&(src=src.replace(calloutLineRegex,value=>value+`
> `)),opts.wikilinks&&(src=src.replace(tableRegex,value=>value.replace(tableWikilinkRegex,(_value,raw)=>{let escaped=raw??"";return escaped=escaped.replace("#","\\#"),escaped=escaped.replace(/((^|[^\\])(\\\\)*)\|/g,"$1\\|"),escaped})),src=src.replace(wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,[fp,anchor]=splitAnchor(`${rawFp??""}${rawHeader??""}`),blockRef=rawHeader?.startsWith("#^")?"^":"",displayAnchor=anchor?`#${blockRef}${anchor.trim().replace(/^#+/,"")}`:"",displayAlias=rawAlias??rawHeader?.replace("#","|")??"",embedDisplay=value.startsWith("!")?"!":"";return rawFp?.match(externalLinkRegex)?`${embedDisplay}[${displayAlias.replace(/^\|/,"")}](${rawFp})`:`${embedDisplay}[[${fp}${displayAnchor}${displayAlias}]]`})),src},markdownPlugins(_ctx){let plugins=[];return plugins.push(()=>(tree,file)=>{let replacements=[],base=pathToRoot(file.data.slug);opts.wikilinks&&replacements.push([wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,fp=rawFp?.trim()??"",anchor=rawHeader?.trim()??"",alias=rawAlias?.slice(1).trim();if(value.startsWith("!")){let ext=path4.extname(fp).toLowerCase(),url2=slugifyFilePath(fp);if([".png",".jpg",".jpeg",".gif",".bmp",".svg",".webp"].includes(ext)){let match=wikilinkImageEmbedRegex.exec(alias??""),alt=match?.groups?.alt??"",width=match?.groups?.width??"auto",height=match?.groups?.height??"auto";return{type:"image",url:url2,data:{hProperties:{width,height,alt}}}}else{if([".mp4",".webm",".ogv",".mov",".mkv"].includes(ext))return{type:"html",value:`<video src="${url2}" controls></video>`};if([".mp3",".webm",".wav",".m4a",".ogg",".3gp",".flac"].includes(ext))return{type:"html",value:`<audio src="${url2}" controls></audio>`};if([".pdf"].includes(ext))return{type:"html",value:`<iframe src="${url2}" class="pdf"></iframe>`};{let block=anchor;return{type:"html",data:{hProperties:{transclude:!0}},value:`<blockquote class="transclude" data-url="${url2}" data-block="${block}" data-embed-alias="${alias}"><a href="${url2+anchor}" class="transclude-inner">Transclude of ${url2}${block}</a></blockquote>`}}}}return{type:"link",url:fp+anchor,children:[{type:"text",value:alias??fp}]}}]),opts.highlight&&replacements.push([highlightRegex,(_value,...capture)=>{let[inner]=capture;return{type:"html",value:`<span class="text-highlight">${inner}</span>`}}]),opts.parseArrows&&replacements.push([arrowRegex,(value,..._capture)=>{let maybeArrow=arrowMapping[value];return maybeArrow===void 0?SKIP:{type:"html",value:`<span>${maybeArrow}</span>`}}]),opts.parseTags&&replacements.push([tagRegex,(_value,tag)=>{if(/^[\/\d]+$/.test(tag))return!1;if(tag=slugTag(tag),file.data.frontmatter){let noteTags=file.data.frontmatter.tags??[];file.data.frontmatter.tags=[...new Set([...noteTags,tag])]}return{type:"link",url:base+`/tags/${tag}`,data:{hProperties:{className:["tag-link"]}},children:[{type:"text",value:tag}]}}]),opts.enableInHtmlEmbed&&visit3(tree,"html",node=>{for(let[regex,replace]of replacements)typeof replace=="string"?node.value=node.value.replace(regex,replace):node.value=node.value.replace(regex,(substring,...args)=>{let replaceValue=replace(substring,...args);return typeof replaceValue=="string"?replaceValue:Array.isArray(replaceValue)?replaceValue.map(mdastToHtml).join(""):typeof replaceValue=="object"&&replaceValue!==null?mdastToHtml(replaceValue):substring})}),mdastFindReplace(tree,replacements)}),opts.enableVideoEmbed&&plugins.push(()=>(tree,_file)=>{visit3(tree,"image",(node,index,parent)=>{if(parent&&index!=null&&videoExtensionRegex.test(node.url)){let newNode={type:"html",value:`<video controls src="${node.url}"></video>`};return parent.children.splice(index,1,newNode),SKIP}})}),opts.callouts&&plugins.push(()=>(tree,_file)=>{visit3(tree,"blockquote",node=>{if(node.children.length===0)return;let[firstChild,...calloutContent]=node.children;if(firstChild.type!=="paragraph"||firstChild.children[0]?.type!=="text")return;let text=firstChild.children[0].value,restOfTitle=firstChild.children.slice(1),[firstLine,...remainingLines]=text.split(`
`),remainingText=remainingLines.join(`
`),match=firstLine.match(calloutRegex);if(match&&match.input){let[calloutDirective,typeString,calloutMetaData,collapseChar]=match,calloutType=canonicalizeCallout(typeString.toLowerCase()),collapse=collapseChar==="+"||collapseChar==="-",defaultState=collapseChar==="-"?"collapsed":"expanded",titleContent=match.input.slice(calloutDirective.length).trim(),titleNode={type:"paragraph",children:[{type:"text",value:titleContent===""&&restOfTitle.length===0?capitalize(typeString).replace(/-/g," "):titleContent+" "},...restOfTitle]},blockquoteContent=[{type:"html",value:`<div
                  class="callout-title"
                >
                  <div class="callout-icon"></div>
                  <div class="callout-title-inner">${mdastToHtml(titleNode)}</div>
                  ${collapse?'<div class="fold-callout-icon"></div>':""}
                </div>`}];remainingText.length>0&&blockquoteContent.push({type:"paragraph",children:[{type:"text",value:remainingText}]}),calloutContent.length>0&&(node.children=[node.children[0],{data:{hProperties:{className:["callout-content"]},hName:"div"},type:"blockquote",children:[{data:{hProperties:{className:["callout-content-inner"]},hName:"div"},type:"blockquote",children:[...calloutContent]}]}]),node.children.splice(0,1,...blockquoteContent);let classNames2=["callout",calloutType];collapse&&classNames2.push("is-collapsible"),defaultState==="collapsed"&&classNames2.push("is-collapsed"),node.data={hProperties:{...node.data?.hProperties??{},className:classNames2.join(" "),"data-callout":calloutType,"data-callout-fold":collapse,"data-callout-metadata":calloutMetaData}}}})}),opts.mermaid&&plugins.push(()=>(tree,file)=>{visit3(tree,"code",node=>{node.lang==="mermaid"&&(file.data.hasMermaidDiagram=!0,node.data={hProperties:{className:["mermaid"],"data-clipboard":JSON.stringify(node.value)}})})}),plugins},htmlPlugins(){let plugins=[rehypeRaw];return opts.parseBlockReferences&&plugins.push(()=>{let inlineTagTypes=new Set(["p","li"]),blockTagTypes=new Set(["blockquote"]);return(tree,file)=>{file.data.blocks={},visit3(tree,"element",(node,index,parent)=>{if(blockTagTypes.has(node.tagName)){let nextChild=parent?.children.at(index+2);if(nextChild&&nextChild.tagName==="p"){let text=nextChild.children.at(0);if(text&&text.value&&text.type==="text"){let matches=text.value.match(blockReferenceRegex);if(matches&&matches.length>=1){parent.children.splice(index+2,1);let block=matches[0].slice(1);Object.keys(file.data.blocks).includes(block)||(node.properties={...node.properties,id:block},file.data.blocks[block]=node)}}}}else if(inlineTagTypes.has(node.tagName)){let last=node.children.at(-1);if(last&&last.value&&typeof last.value=="string"){let matches=last.value.match(blockReferenceRegex);if(matches&&matches.length>=1){last.value=last.value.slice(0,-matches[0].length);let block=matches[0].slice(1);if(last.value===""){let idx=(index??1)-1;for(;idx>=0;){let element=parent?.children.at(idx);if(!element)break;if(element.type!=="element")idx-=1;else{Object.keys(file.data.blocks).includes(block)||(element.properties={...element.properties,id:block},file.data.blocks[block]=element);return}}}else Object.keys(file.data.blocks).includes(block)||(node.properties={...node.properties,id:block},file.data.blocks[block]=node)}}}}),file.data.htmlAst=tree}}),opts.enableYouTubeEmbed&&plugins.push(()=>tree=>{visit3(tree,"element",node=>{if(node.tagName==="img"&&typeof node.properties.src=="string"){let match=node.properties.src.match(ytLinkRegex),videoId=match&&match[2].length==11?match[2]:null,playlistId=node.properties.src.match(ytPlaylistLinkRegex)?.[1];videoId?(node.tagName="iframe",node.properties={class:"external-embed youtube",allow:"fullscreen",frameborder:0,width:"600px",src:playlistId?`https://www.youtube.com/embed/${videoId}?list=${playlistId}`:`https://www.youtube.com/embed/${videoId}`}):playlistId&&(node.tagName="iframe",node.properties={class:"external-embed youtube",allow:"fullscreen",frameborder:0,width:"600px",src:`https://www.youtube.com/embed/videoseries?list=${playlistId}`})}})}),opts.enableCheckbox&&plugins.push(()=>(tree,_file)=>{visit3(tree,"element",node=>{if(node.tagName==="input"&&node.properties.type==="checkbox"){let isChecked=node.properties?.checked??!1;node.properties={type:"checkbox",disabled:!1,checked:isChecked,class:"checkbox-toggle"}}})}),opts.mermaid&&plugins.push(()=>(tree,_file)=>{visit3(tree,"element",(node,_idx,parent)=>{node.tagName==="code"&&(node.properties?.className??[])?.includes("mermaid")&&(parent.children=[{type:"element",tagName:"button",properties:{className:["expand-button"],"aria-label":"Expand mermaid diagram","data-view-component":!0},children:[{type:"element",tagName:"svg",properties:{width:16,height:16,viewBox:"0 0 16 16",fill:"currentColor"},children:[{type:"element",tagName:"path",properties:{fillRule:"evenodd",d:"M3.72 3.72a.75.75 0 011.06 1.06L2.56 7h10.88l-2.22-2.22a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.56l2.22 2.22a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5z"},children:[]}]}]},node,{type:"element",tagName:"div",properties:{id:"mermaid-container",role:"dialog"},children:[{type:"element",tagName:"div",properties:{id:"mermaid-space"},children:[{type:"element",tagName:"div",properties:{className:["mermaid-content"]},children:[]}]}]}])})}),plugins},externalResources(){let js=[],css=[];return opts.enableCheckbox&&js.push({script:checkbox_inline_default,loadTime:"afterDOMReady",contentType:"inline"}),opts.callouts&&js.push({script:callout_inline_default,loadTime:"afterDOMReady",contentType:"inline"}),opts.mermaid&&(js.push({script:mermaid_inline_default,loadTime:"afterDOMReady",contentType:"inline",moduleType:"module"}),css.push({content:mermaid_inline_default2,inline:!0})),{js,css}}}},"ObsidianFlavoredMarkdown");var relrefRegex=new RegExp(/\[([^\]]+)\]\(\{\{< relref "([^"]+)" >\}\}\)/,"g"),predefinedHeadingIdRegex=new RegExp(/(.*) {#(?:.*)}/,"g"),hugoShortcodeRegex=new RegExp(/{{(.*)}}/,"g"),figureTagRegex=new RegExp(/< ?figure src="(.*)" ?>/,"g"),inlineLatexRegex=new RegExp(/\\\\\((.+?)\\\\\)/,"g"),blockLatexRegex=new RegExp(/(?:\\begin{equation}|\\\\\(|\\\\\[)([\s\S]*?)(?:\\\\\]|\\\\\)|\\end{equation})/,"g"),quartzLatexRegex=new RegExp(/\$\$[\s\S]*?\$\$|\$.*?\$/,"g");import rehypePrettyCode from"rehype-pretty-code";var defaultOptions7={theme:{light:"github-light",dark:"github-dark"},keepBackground:!1},SyntaxHighlighting=__name(userOpts=>{let opts={...defaultOptions7,...userOpts};return{name:"SyntaxHighlighting",htmlPlugins(){return[[rehypePrettyCode,opts]]}}},"SyntaxHighlighting");import{visit as visit4}from"unist-util-visit";import{toString as toString2}from"mdast-util-to-string";import Slugger from"github-slugger";var defaultOptions8={maxDepth:3,minEntries:1,showByDefault:!0,collapseByDefault:!1},slugAnchor2=new Slugger,TableOfContents=__name(userOpts=>{let opts={...defaultOptions8,...userOpts};return{name:"TableOfContents",markdownPlugins(){return[()=>async(tree,file)=>{if(file.data.frontmatter?.enableToc??opts.showByDefault){slugAnchor2.reset();let toc=[],highestDepth=opts.maxDepth;visit4(tree,"heading",node=>{if(node.depth<=opts.maxDepth){let text=toString2(node);highestDepth=Math.min(highestDepth,node.depth),toc.push({depth:node.depth,text,slug:slugAnchor2.slug(text)})}}),toc.length>0&&toc.length>opts.minEntries&&(file.data.toc=toc.map(entry=>({...entry,depth:entry.depth-highestDepth})),file.data.collapseToc=opts.collapseByDefault)}}]}}},"TableOfContents");import remarkBreaks from"remark-breaks";import{visit as visit5}from"unist-util-visit";import{findAndReplace as mdastFindReplace2}from"mdast-util-find-and-replace";var orRegex=new RegExp(/{{or:(.*?)}}/,"g"),TODORegex=new RegExp(/{{.*?\bTODO\b.*?}}/,"g"),DONERegex=new RegExp(/{{.*?\bDONE\b.*?}}/,"g"),blockquoteRegex=new RegExp(/(\[\[>\]\])\s*(.*)/,"g"),roamHighlightRegex=new RegExp(/\^\^(.+)\^\^/,"g"),roamItalicRegex=new RegExp(/__(.+)__/,"g");var RemoveDrafts=__name(()=>({name:"RemoveDrafts",shouldPublish(_ctx,[_tree,vfile]){return!(vfile.data?.frontmatter?.draft===!0||vfile.data?.frontmatter?.draft==="true")}}),"RemoveDrafts");import path6 from"path";import{jsx}from"preact/jsx-runtime";var Header=__name(({children})=>children.length>0?jsx("header",{children}):null,"Header");Header.css=`
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
}
`;var Header_default=__name(()=>Header,"default");var clipboard_inline_default=`var r='<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>',l='<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';document.addEventListener("nav",()=>{let a=document.getElementsByTagName("pre");for(let t=0;t<a.length;t++){let n=a[t].getElementsByTagName("code")[0];if(n){let o=function(){navigator.clipboard.writeText(i).then(()=>{e.blur(),e.innerHTML=l,setTimeout(()=>{e.innerHTML=r,e.style.borderColor=""},2e3)},d=>console.error(d))};var c=o;let i=(n.dataset.clipboard?JSON.parse(n.dataset.clipboard):n.innerText).replace(/\\n\\n/g,\`
\`),e=document.createElement("button");e.className="clipboard-button",e.type="button",e.innerHTML=r,e.ariaLabel="Copy source",e.addEventListener("click",o),window.addCleanup(()=>e.removeEventListener("click",o)),a[t].prepend(e)}}});
`;var clipboard_default=`.clipboard-button {
  position: absolute;
  display: flex;
  float: right;
  right: 0;
  padding: 0.4rem;
  margin: 0.3rem;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.clipboard-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.clipboard-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.clipboard-button:focus {
  outline: 0;
}

pre:hover > .clipboard-button {
  opacity: 1;
  transition: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyJjbGlwYm9hcmQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTs7O0FBS0Y7RUFDRTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLmNsaXBib2FyZC1idXR0b24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsb2F0OiByaWdodDtcbiAgcmlnaHQ6IDA7XG4gIHBhZGRpbmc6IDAuNHJlbTtcbiAgbWFyZ2luOiAwLjNyZW07XG4gIGNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICBib3JkZXI6IDFweCBzb2xpZDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiAwLjJzO1xuXG4gICYgPiBzdmcge1xuICAgIGZpbGw6IHZhcigtLWxpZ2h0KTtcbiAgICBmaWx0ZXI6IGNvbnRyYXN0KDAuMyk7XG4gIH1cblxuICAmOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICB9XG5cbiAgJjpmb2N1cyB7XG4gICAgb3V0bGluZTogMDtcbiAgfVxufVxuXG5wcmUge1xuICAmOmhvdmVyID4gLmNsaXBib2FyZC1idXR0b24ge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNpdGlvbjogMC4ycztcbiAgfVxufVxuIl19 */`;import{jsx as jsx2}from"preact/jsx-runtime";var Body=__name(({children})=>jsx2("div",{id:"quartz-body",children}),"Body");Body.afterDOMLoaded=clipboard_inline_default;Body.css=clipboard_default;var Body_default=__name(()=>Body,"default");import{render}from"preact-render-to-string";import{randomUUID}from"crypto";import{jsx as jsx3}from"preact/jsx-runtime";function JSResourceToScriptElement(resource,preserve){let scriptType=resource.moduleType??"application/javascript",spaPreserve=preserve??resource.spaPreserve;if(resource.contentType==="external")return jsx3("script",{src:resource.src,type:scriptType,"spa-preserve":spaPreserve},resource.src);{let content=resource.script;return jsx3("script",{type:scriptType,"spa-preserve":spaPreserve,dangerouslySetInnerHTML:{__html:content}},randomUUID())}}__name(JSResourceToScriptElement,"JSResourceToScriptElement");function CSSResourceToStyleElement(resource,preserve){let spaPreserve=preserve??resource.spaPreserve;return resource.inline??!1?jsx3("style",{children:resource.content}):jsx3("link",{href:resource.content,rel:"stylesheet",type:"text/css","spa-preserve":spaPreserve},resource.content)}__name(CSSResourceToStyleElement,"CSSResourceToStyleElement");function concatenateResources(...resources){return resources.filter(resource=>resource!==void 0).flat()}__name(concatenateResources,"concatenateResources");import{visit as visit6}from"unist-util-visit";import{jsx as jsx4,jsxs}from"preact/jsx-runtime";var headerRegex=new RegExp(/h[1-6]/);function pageResources(baseDir,staticResources){let contentIndexScript=`const fetchData = fetch("${joinSegments(baseDir,"static/contentIndex.json")}").then(data => data.json())`,resources={css:[{content:joinSegments(baseDir,"index.css")},...staticResources.css],js:[{src:joinSegments(baseDir,"prescript.js"),loadTime:"beforeDOMReady",contentType:"external"},{loadTime:"beforeDOMReady",contentType:"inline",spaPreserve:!0,script:contentIndexScript},...staticResources.js],additionalHead:staticResources.additionalHead};return resources.js.push({src:joinSegments(baseDir,"postscript.js"),loadTime:"afterDOMReady",moduleType:"module",contentType:"external"}),resources}__name(pageResources,"pageResources");function renderTranscludes(root,cfg,slug,componentData){visit6(root,"element",(node,_index,_parent)=>{if(node.tagName==="blockquote"&&(node.properties?.className??[]).includes("transclude")){let inner=node.children[0],transcludeTarget=inner.properties["data-slug"]??slug,page=componentData.allFiles.find(f=>f.slug===transcludeTarget);if(!page)return;let blockRef=node.properties.dataBlock;if(blockRef?.startsWith("#^")){blockRef=blockRef.slice(2);let blockNode=page.blocks?.[blockRef];blockNode&&(blockNode.tagName==="li"&&(blockNode={type:"element",tagName:"ul",properties:{},children:[blockNode]}),node.children=[normalizeHastElement(blockNode,slug,transcludeTarget),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}])}else if(blockRef?.startsWith("#")&&page.htmlAst){blockRef=blockRef.slice(1);let startIdx,startDepth,endIdx;for(let[i,el]of page.htmlAst.children.entries()){if(!(el.type==="element"&&el.tagName.match(headerRegex)))continue;let depth=Number(el.tagName.substring(1));if(startIdx===void 0||startDepth===void 0)el.properties?.id===blockRef&&(startIdx=i,startDepth=depth);else if(depth<=startDepth){endIdx=i;break}}if(startIdx===void 0)return;node.children=[...page.htmlAst.children.slice(startIdx,endIdx).map(child=>normalizeHastElement(child,slug,transcludeTarget)),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}]}else page.htmlAst&&(node.children=[{type:"element",tagName:"h1",properties:{},children:[{type:"text",value:page.frontmatter?.title??i18n(cfg.locale).components.transcludes.transcludeOf({targetSlug:page.slug})}]},...page.htmlAst.children.map(child=>normalizeHastElement(child,slug,transcludeTarget)),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}])}})}__name(renderTranscludes,"renderTranscludes");function renderPage(cfg,slug,componentData,components,pageResources2){let root=clone(componentData.tree);renderTranscludes(root,cfg,slug,componentData),componentData.tree=root;let{head:Head,header,beforeBody,pageBody:Content2,afterBody,left,right,footer:Footer}=components,Header2=Header_default(),Body2=Body_default(),LeftComponent=jsx4("div",{class:"left sidebar",children:left.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),RightComponent=jsx4("div",{class:"right sidebar",children:right.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),lang=componentData.fileData.frontmatter?.lang??cfg.locale?.split("-")[0]??"en",doc=jsxs("html",{lang,children:[jsx4(Head,{...componentData}),jsx4("body",{"data-slug":slug,children:jsx4("div",{id:"quartz-root",class:"page",children:jsxs(Body2,{...componentData,children:[LeftComponent,jsxs("div",{class:"center",children:[jsxs("div",{class:"page-header",children:[jsx4(Header2,{...componentData,children:header.map(HeaderComponent=>jsx4(HeaderComponent,{...componentData}))}),jsx4("div",{class:"popover-hint",children:beforeBody.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))})]}),jsx4(Content2,{...componentData}),jsx4("hr",{}),jsx4("div",{class:"page-footer",children:afterBody.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))})]}),RightComponent,jsx4(Footer,{...componentData})]})})}),pageResources2.js.filter(resource=>resource.loadTime==="afterDOMReady").map(res=>JSResourceToScriptElement(res))]});return`<!DOCTYPE html>
`+render(doc)}__name(renderPage,"renderPage");import{toJsxRuntime}from"hast-util-to-jsx-runtime";import{Fragment,jsx as jsx5,jsxs as jsxs2}from"preact/jsx-runtime";import{jsx as jsx6}from"preact/jsx-runtime";var customComponents={table:__name(props=>jsx6("div",{class:"table-container",children:jsx6("table",{...props})}),"table")};function htmlToJsx(fp,tree){try{return toJsxRuntime(tree,{Fragment,jsx:jsx5,jsxs:jsxs2,elementAttributeNameCase:"html",components:customComponents})}catch(e){trace(`Failed to parse Markdown in \`${fp}\` into JSX`,e)}}__name(htmlToJsx,"htmlToJsx");import{jsx as jsx7}from"preact/jsx-runtime";var Content=__name(({fileData,tree})=>{let content=htmlToJsx(fileData.filePath,tree),classString=["popover-hint",...fileData.frontmatter?.cssclasses??[]].join(" ");return jsx7("article",{class:classString,children:content})},"Content"),Content_default=__name(()=>Content,"default");var listPage_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
ul.section-ul {
  list-style: none;
  margin-top: 2em;
  padding-left: 0;
}

li.section-li {
  margin-bottom: 1em;
}
li.section-li > .section {
  display: grid;
  grid-template-columns: fit-content(8em) 3fr 1fr;
}
@media all and ((max-width: 800px)) {
  li.section-li > .section > .tags {
    display: none;
  }
}
li.section-li > .section > .desc > h3 > a {
  background-color: transparent;
}
li.section-li > .section .meta {
  margin: 0 1em 0 0;
  opacity: 0.6;
}

.popover .section {
  grid-template-columns: fit-content(8em) 1fr !important;
}
.popover .section > .tags {
  display: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3MiLCJsaXN0UGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FDQUE7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7O0FBRUE7RUFDRTtFQUNBOztBQUVBO0VBQ0U7SUFDRTs7O0FBSUo7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7OztBQU1OO0VBQ0U7O0FBRUE7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCJzYXNzOm1hcFwiO1xuXG4vKipcbiAqIExheW91dCBicmVha3BvaW50c1xuICogJG1vYmlsZTogc2NyZWVuIHdpZHRoIGJlbG93IHRoaXMgdmFsdWUgd2lsbCB1c2UgbW9iaWxlIHN0eWxlc1xuICogJGRlc2t0b3A6IHNjcmVlbiB3aWR0aCBhYm92ZSB0aGlzIHZhbHVlIHdpbGwgdXNlIGRlc2t0b3Agc3R5bGVzXG4gKiBTY3JlZW4gd2lkdGggYmV0d2VlbiAkbW9iaWxlIGFuZCAkZGVza3RvcCB3aWR0aCB3aWxsIHVzZSB0aGUgdGFibGV0IGxheW91dC5cbiAqIGFzc3VtaW5nIG1vYmlsZSA8IGRlc2t0b3BcbiAqL1xuJGJyZWFrcG9pbnRzOiAoXG4gIG1vYmlsZTogODAwcHgsXG4gIGRlc2t0b3A6IDEyMDBweCxcbik7XG5cbiRtb2JpbGU6IFwiKG1heC13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pXCI7XG4kdGFibGV0OiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KSBhbmQgKG1heC13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9KVwiO1xuJGRlc2t0b3A6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9KVwiO1xuXG4kcGFnZVdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfTtcbiRzaWRlUGFuZWxXaWR0aDogMzIwcHg7IC8vMzgwcHg7XG4kdG9wU3BhY2luZzogNnJlbTtcbiRib2xkV2VpZ2h0OiA3MDA7XG4kc2VtaUJvbGRXZWlnaHQ6IDYwMDtcbiRub3JtYWxXZWlnaHQ6IDQwMDtcblxuJG1vYmlsZUdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiYXV0b1wiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdFwiXFxcbiAgICAgIFwiZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtZm9vdGVyXCInLFxuKTtcbiR0YWJsZXRHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0b1wiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXJcIicsXG4pO1xuJGRlc2t0b3BHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG8gI3skc2lkZVBhbmVsV2lkdGh9XCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1jZW50ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlciBncmlkLXNpZGViYXItcmlnaHRcIicsXG4pO1xuIiwiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5cbnVsLnNlY3Rpb24tdWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBtYXJnaW4tdG9wOiAyZW07XG4gIHBhZGRpbmctbGVmdDogMDtcbn1cblxubGkuc2VjdGlvbi1saSB7XG4gIG1hcmdpbi1ib3R0b206IDFlbTtcblxuICAmID4gLnNlY3Rpb24ge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBmaXQtY29udGVudCg4ZW0pIDNmciAxZnI7XG5cbiAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgJiA+IC50YWdzIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmID4gLmRlc2MgPiBoMyA+IGEge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgfVxuXG4gICAgJiAubWV0YSB7XG4gICAgICBtYXJnaW46IDAgMWVtIDAgMDtcbiAgICAgIG9wYWNpdHk6IDAuNjtcbiAgICB9XG4gIH1cbn1cblxuLy8gbW9kaWZpY2F0aW9ucyBpbiBwb3BvdmVyIGNvbnRleHRcbi5wb3BvdmVyIC5zZWN0aW9uIHtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBmaXQtY29udGVudCg4ZW0pIDFmciAhaW1wb3J0YW50O1xuXG4gICYgPiAudGFncyB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuIl19 */`;import{jsx as jsx8}from"preact/jsx-runtime";function getDate(cfg,data){if(!cfg.defaultDateType)throw new Error("Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.");return data.dates?.[cfg.defaultDateType]}__name(getDate,"getDate");function formatDate(d,locale="en-US"){return d.toLocaleDateString(locale,{year:"numeric",month:"short",day:"2-digit"})}__name(formatDate,"formatDate");function Date2({date,locale}){return jsx8("time",{datetime:date.toISOString(),children:formatDate(date,locale)})}__name(Date2,"Date");import{jsx as jsx9,jsxs as jsxs3}from"preact/jsx-runtime";function byDateAndAlphabetical(cfg){return(f1,f2)=>{if(f1.dates&&f2.dates)return getDate(cfg,f2).getTime()-getDate(cfg,f1).getTime();if(f1.dates&&!f2.dates)return-1;if(!f1.dates&&f2.dates)return 1;let f1Title=f1.frontmatter?.title.toLowerCase()??"",f2Title=f2.frontmatter?.title.toLowerCase()??"";return f1Title.localeCompare(f2Title)}}__name(byDateAndAlphabetical,"byDateAndAlphabetical");function byDateAndAlphabeticalFolderFirst(cfg){return(f1,f2)=>{let f1IsFolder=isFolderPath(f1.slug??""),f2IsFolder=isFolderPath(f2.slug??"");if(f1IsFolder&&!f2IsFolder)return-1;if(!f1IsFolder&&f2IsFolder)return 1;if(f1.dates&&f2.dates)return getDate(cfg,f2).getTime()-getDate(cfg,f1).getTime();if(f1.dates&&!f2.dates)return-1;if(!f1.dates&&f2.dates)return 1;let f1Title=f1.frontmatter?.title.toLowerCase()??"",f2Title=f2.frontmatter?.title.toLowerCase()??"";return f1Title.localeCompare(f2Title)}}__name(byDateAndAlphabeticalFolderFirst,"byDateAndAlphabeticalFolderFirst");var PageList=__name(({cfg,fileData,allFiles,limit,sort})=>{let sorter=sort??byDateAndAlphabeticalFolderFirst(cfg),list=allFiles.sort(sorter);return limit&&(list=list.slice(0,limit)),jsx9("ul",{class:"section-ul",children:list.map(page=>{let title=page.frontmatter?.title,tags=page.frontmatter?.tags??[];return jsx9("li",{class:"section-li",children:jsxs3("div",{class:"section",children:[jsx9("p",{class:"meta",children:page.dates&&jsx9(Date2,{date:getDate(cfg,page),locale:cfg.locale})}),jsx9("div",{class:"desc",children:jsx9("h3",{children:jsx9("a",{href:resolveRelative(fileData.slug,page.slug),class:"internal",children:title})})}),jsx9("ul",{class:"tags",children:tags.map(tag=>jsx9("li",{children:jsx9("a",{class:"internal tag-link",href:resolveRelative(fileData.slug,`tags/${tag}`),children:tag})}))})]})})})})},"PageList");PageList.css=`
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;import{Fragment as Fragment2,jsx as jsx10,jsxs as jsxs4}from"preact/jsx-runtime";var defaultOptions9={numPages:10},TagContent_default=__name(opts=>{let options2={...defaultOptions9,...opts},TagContent=__name(props=>{let{tree,fileData,allFiles,cfg}=props,slug=fileData.slug;if(!(slug?.startsWith("tags/")||slug==="tags"))throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`);let tag=simplifySlug(slug.slice(5)),allPagesWithTag=__name(tag2=>allFiles.filter(file=>(file.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes).includes(tag2)),"allPagesWithTag"),content=tree.children.length===0?fileData.description:htmlToJsx(fileData.filePath,tree),classes=(fileData.frontmatter?.cssclasses??[]).join(" ");if(tag==="/"){let tags=[...new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes))].sort((a,b)=>a.localeCompare(b)),tagItemMap=new Map;for(let tag2 of tags)tagItemMap.set(tag2,allPagesWithTag(tag2));return jsxs4("div",{class:"popover-hint",children:[jsx10("article",{class:classes,children:jsx10("p",{children:content})}),jsx10("p",{children:i18n(cfg.locale).pages.tagContent.totalTags({count:tags.length})}),jsx10("div",{children:tags.map(tag2=>{let pages=tagItemMap.get(tag2),listProps={...props,allFiles:pages},contentPage=allFiles.filter(file=>file.slug===`tags/${tag2}`).at(0),root=contentPage?.htmlAst,content2=!root||root?.children.length===0?contentPage?.description:htmlToJsx(contentPage.filePath,root),tagListingPage=`/tags/${tag2}`,href=resolveRelative(fileData.slug,tagListingPage);return jsxs4("div",{children:[jsx10("h2",{children:jsx10("a",{class:"internal tag-link",href,children:tag2})}),content2&&jsx10("p",{children:content2}),jsxs4("div",{class:"page-listing",children:[jsxs4("p",{children:[i18n(cfg.locale).pages.tagContent.itemsUnderTag({count:pages.length}),pages.length>options2.numPages&&jsxs4(Fragment2,{children:[" ",jsx10("span",{children:i18n(cfg.locale).pages.tagContent.showingFirst({count:options2.numPages})})]})]}),jsx10(PageList,{limit:options2.numPages,...listProps,sort:options2?.sort})]})]})})})]})}else{let pages=allPagesWithTag(tag),listProps={...props,allFiles:pages};return jsxs4("div",{class:"popover-hint",children:[jsx10("article",{class:classes,children:content}),jsxs4("div",{class:"page-listing",children:[jsx10("p",{children:i18n(cfg.locale).pages.tagContent.itemsUnderTag({count:pages.length})}),jsx10("div",{children:jsx10(PageList,{...listProps,sort:options2?.sort})})]})]})}},"TagContent");return TagContent.css=concatenateResources(listPage_default,PageList.css),TagContent},"default");var FileTrieNode=class _FileTrieNode{static{__name(this,"FileTrieNode")}isFolder;children;slugSegments;fileSegmentHint;displayNameOverride;data;constructor(segments,data){this.children=[],this.slugSegments=segments,this.data=data??null,this.isFolder=!1,this.displayNameOverride=void 0}get displayName(){let nonIndexTitle=this.data?.title==="index"?void 0:this.data?.title;return this.displayNameOverride??nonIndexTitle??this.fileSegmentHint??this.slugSegment??""}set displayName(name){this.displayNameOverride=name}get slug(){let path12=joinSegments(...this.slugSegments);return this.isFolder?joinSegments(path12,"index"):path12}get slugSegment(){return this.slugSegments[this.slugSegments.length-1]}makeChild(path12,file){let fullPath=[...this.slugSegments,path12[0]],child=new _FileTrieNode(fullPath,file);return this.children.push(child),child}insert(path12,file){if(path12.length===0)throw new Error("path is empty");this.isFolder=!0;let segment=path12[0];if(path12.length===1)segment==="index"?this.data??=file:this.makeChild(path12,file);else if(path12.length>1){let child=this.children.find(c=>c.slugSegment===segment)??this.makeChild(path12,void 0),fileParts=file.filePath.split("/");child.fileSegmentHint=fileParts.at(-path12.length),child.insert(path12.slice(1),file)}}add(file){this.insert(file.slug.split("/"),file)}findNode(path12){return path12.length===0||path12.length===1&&path12[0]==="index"?this:this.children.find(c=>c.slugSegment===path12[0])?.findNode(path12.slice(1))}ancestryChain(path12){if(path12.length===0||path12.length===1&&path12[0]==="index")return[this];let child=this.children.find(c=>c.slugSegment===path12[0]);if(!child)return;let childPath=child.ancestryChain(path12.slice(1));if(childPath)return[this,...childPath]}filter(filterFn){this.children=this.children.filter(filterFn),this.children.forEach(child=>child.filter(filterFn))}map(mapFn){mapFn(this),this.children.forEach(child=>child.map(mapFn))}sort(sortFn){this.children=this.children.sort(sortFn),this.children.forEach(e=>e.sort(sortFn))}static fromEntries(entries){let trie=new _FileTrieNode([]);return entries.forEach(([,entry])=>trie.add(entry)),trie}entries(){let traverse=__name(node=>[[node.slug,node]].concat(...node.children.map(traverse)),"traverse");return traverse(this)}getFolderPaths(){return this.entries().filter(([_,node])=>node.isFolder).map(([path12,_])=>path12)}};function trieFromAllFiles(allFiles){let trie=new FileTrieNode([]);return allFiles.forEach(file=>{file.frontmatter&&trie.add({...file,slug:file.slug,title:file.frontmatter.title,filePath:file.filePath})}),trie}__name(trieFromAllFiles,"trieFromAllFiles");import{jsx as jsx11,jsxs as jsxs5}from"preact/jsx-runtime";var defaultOptions10={showFolderCount:!0,showSubfolders:!0},FolderContent_default=__name(opts=>{let options2={...defaultOptions10,...opts},FolderContent=__name(props=>{let{tree,fileData,allFiles,cfg}=props,folder=(props.ctx.trie??=trieFromAllFiles(allFiles)).findNode(fileData.slug.split("/"));if(!folder)return null;let allPagesInFolder=folder.children.map(node=>{if(node.data)return node.data;if(node.isFolder&&options2.showSubfolders){let getMostRecentDates=__name(()=>{let maybeDates;for(let child of node.children)child.data?.dates&&(maybeDates?(child.data.dates.created>maybeDates.created&&(maybeDates.created=child.data.dates.created),child.data.dates.modified>maybeDates.modified&&(maybeDates.modified=child.data.dates.modified),child.data.dates.published>maybeDates.published&&(maybeDates.published=child.data.dates.published)):maybeDates={...child.data.dates});return maybeDates??{created:new Date,modified:new Date,published:new Date}},"getMostRecentDates");return{slug:node.slug,dates:getMostRecentDates(),frontmatter:{title:node.displayName,tags:[]}}}}).filter(page=>page!==void 0)??[],classes=(fileData.frontmatter?.cssclasses??[]).join(" "),listProps={...props,sort:options2.sort,allFiles:allPagesInFolder},content=tree.children.length===0?fileData.description:htmlToJsx(fileData.filePath,tree);return jsxs5("div",{class:"popover-hint",children:[jsx11("article",{class:classes,children:content}),jsxs5("div",{class:"page-listing",children:[options2.showFolderCount&&jsx11("p",{children:i18n(cfg.locale).pages.folderContent.itemsUnderFolder({count:allPagesInFolder.length})}),jsx11("div",{children:jsx11(PageList,{...listProps})})]})]})},"FolderContent");return FolderContent.css=concatenateResources(listPage_default,PageList.css),FolderContent},"default");import{jsx as jsx12,jsxs as jsxs6}from"preact/jsx-runtime";var NotFound=__name(({cfg})=>{let baseDir=new URL(`https://${cfg.baseUrl??"example.com"}`).pathname;return jsxs6("article",{class:"popover-hint",children:[jsx12("h1",{children:"404"}),jsx12("p",{children:i18n(cfg.locale).pages.error.notFound}),jsx12("a",{href:baseDir,children:i18n(cfg.locale).pages.error.home})]})},"NotFound"),__default=__name(()=>NotFound,"default");import{jsx as jsx13}from"preact/jsx-runtime";var ArticleTitle=__name(({fileData,displayClass})=>{let title=fileData.frontmatter?.title;return title?jsx13("h1",{class:classNames(displayClass,"article-title"),children:title}):null},"ArticleTitle");ArticleTitle.css=`
.article-title {
  margin: 2rem 0 0 0;
}
`;var ArticleTitle_default=__name(()=>ArticleTitle,"default");var darkmode_inline_default=`var c=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark",d=localStorage.getItem("theme")??c;document.documentElement.setAttribute("saved-theme",d);var a=t=>{let n=new CustomEvent("themechange",{detail:{theme:t}});document.dispatchEvent(n)};document.addEventListener("nav",()=>{let t=()=>{let e=document.documentElement.getAttribute("saved-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("saved-theme",e),localStorage.setItem("theme",e),a(e)},n=e=>{let m=e.matches?"dark":"light";document.documentElement.setAttribute("saved-theme",m),localStorage.setItem("theme",m),a(m)};for(let e of document.getElementsByClassName("darkmode"))e.addEventListener("click",t),window.addCleanup(()=>e.removeEventListener("click",t));let o=window.matchMedia("(prefers-color-scheme: dark)");o.addEventListener("change",n),window.addCleanup(()=>o.removeEventListener("change",n))});
`;var darkmode_default=`.darkmode {
  cursor: pointer;
  padding: 0;
  position: relative;
  background: none;
  border: none;
  width: 20px;
  height: 20px;
  margin: 0;
  text-align: inherit;
  flex-shrink: 0;
}
.darkmode svg {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  fill: var(--darkgray);
  transition: opacity 0.1s ease;
}

:root[saved-theme=dark] {
  color-scheme: dark;
}

:root[saved-theme=light] {
  color-scheme: light;
}

:root[saved-theme=dark] .darkmode > .dayIcon {
  display: none;
}
:root[saved-theme=dark] .darkmode > .nightIcon {
  display: inline;
}

:root .darkmode > .dayIcon {
  display: inline;
}
:root .darkmode > .nightIcon {
  display: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyJkYXJrbW9kZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUlKO0VBQ0U7OztBQUdGO0VBQ0U7OztBQUlBO0VBQ0U7O0FBRUY7RUFDRTs7O0FBS0Y7RUFDRTs7QUFFRjtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiLmRhcmttb2RlIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgd2lkdGg6IDIwcHg7XG4gIGhlaWdodDogMjBweDtcbiAgbWFyZ2luOiAwO1xuICB0ZXh0LWFsaWduOiBpbmhlcml0O1xuICBmbGV4LXNocmluazogMDtcblxuICAmIHN2ZyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHdpZHRoOiAyMHB4O1xuICAgIGhlaWdodDogMjBweDtcbiAgICB0b3A6IGNhbGMoNTAlIC0gMTBweCk7XG4gICAgZmlsbDogdmFyKC0tZGFya2dyYXkpO1xuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4xcyBlYXNlO1xuICB9XG59XG5cbjpyb290W3NhdmVkLXRoZW1lPVwiZGFya1wiXSB7XG4gIGNvbG9yLXNjaGVtZTogZGFyaztcbn1cblxuOnJvb3Rbc2F2ZWQtdGhlbWU9XCJsaWdodFwiXSB7XG4gIGNvbG9yLXNjaGVtZTogbGlnaHQ7XG59XG5cbjpyb290W3NhdmVkLXRoZW1lPVwiZGFya1wiXSAuZGFya21vZGUge1xuICAmID4gLmRheUljb24ge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgJiA+IC5uaWdodEljb24ge1xuICAgIGRpc3BsYXk6IGlubGluZTtcbiAgfVxufVxuXG46cm9vdCAuZGFya21vZGUge1xuICAmID4gLmRheUljb24ge1xuICAgIGRpc3BsYXk6IGlubGluZTtcbiAgfVxuICAmID4gLm5pZ2h0SWNvbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuIl19 */`;import{jsx as jsx14,jsxs as jsxs7}from"preact/jsx-runtime";var Darkmode=__name(({displayClass,cfg})=>jsxs7("button",{class:classNames(displayClass,"darkmode"),children:[jsxs7("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"dayIcon",x:"0px",y:"0px",viewBox:"0 0 35 35",style:"enable-background:new 0 0 35 35",xmlSpace:"preserve","aria-label":i18n(cfg.locale).components.themeToggle.darkMode,children:[jsx14("title",{children:i18n(cfg.locale).components.themeToggle.darkMode}),jsx14("path",{d:"M6,17.5C6,16.672,5.328,16,4.5,16h-3C0.672,16,0,16.672,0,17.5    S0.672,19,1.5,19h3C5.328,19,6,18.328,6,17.5z M7.5,26c-0.414,0-0.789,0.168-1.061,0.439l-2,2C4.168,28.711,4,29.086,4,29.5    C4,30.328,4.671,31,5.5,31c0.414,0,0.789-0.168,1.06-0.44l2-2C8.832,28.289,9,27.914,9,27.5C9,26.672,8.329,26,7.5,26z M17.5,6    C18.329,6,19,5.328,19,4.5v-3C19,0.672,18.329,0,17.5,0S16,0.672,16,1.5v3C16,5.328,16.671,6,17.5,6z M27.5,9    c0.414,0,0.789-0.168,1.06-0.439l2-2C30.832,6.289,31,5.914,31,5.5C31,4.672,30.329,4,29.5,4c-0.414,0-0.789,0.168-1.061,0.44    l-2,2C26.168,6.711,26,7.086,26,7.5C26,8.328,26.671,9,27.5,9z M6.439,8.561C6.711,8.832,7.086,9,7.5,9C8.328,9,9,8.328,9,7.5    c0-0.414-0.168-0.789-0.439-1.061l-2-2C6.289,4.168,5.914,4,5.5,4C4.672,4,4,4.672,4,5.5c0,0.414,0.168,0.789,0.439,1.06    L6.439,8.561z M33.5,16h-3c-0.828,0-1.5,0.672-1.5,1.5s0.672,1.5,1.5,1.5h3c0.828,0,1.5-0.672,1.5-1.5S34.328,16,33.5,16z     M28.561,26.439C28.289,26.168,27.914,26,27.5,26c-0.828,0-1.5,0.672-1.5,1.5c0,0.414,0.168,0.789,0.439,1.06l2,2    C28.711,30.832,29.086,31,29.5,31c0.828,0,1.5-0.672,1.5-1.5c0-0.414-0.168-0.789-0.439-1.061L28.561,26.439z M17.5,29    c-0.829,0-1.5,0.672-1.5,1.5v3c0,0.828,0.671,1.5,1.5,1.5s1.5-0.672,1.5-1.5v-3C19,29.672,18.329,29,17.5,29z M17.5,7    C11.71,7,7,11.71,7,17.5S11.71,28,17.5,28S28,23.29,28,17.5S23.29,7,17.5,7z M17.5,25c-4.136,0-7.5-3.364-7.5-7.5    c0-4.136,3.364-7.5,7.5-7.5c4.136,0,7.5,3.364,7.5,7.5C25,21.636,21.636,25,17.5,25z"})]}),jsxs7("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"nightIcon",x:"0px",y:"0px",viewBox:"0 0 100 100",style:"enable-background:new 0 0 100 100",xmlSpace:"preserve","aria-label":i18n(cfg.locale).components.themeToggle.lightMode,children:[jsx14("title",{children:i18n(cfg.locale).components.themeToggle.lightMode}),jsx14("path",{d:"M96.76,66.458c-0.853-0.852-2.15-1.064-3.23-0.534c-6.063,2.991-12.858,4.571-19.655,4.571  C62.022,70.495,50.88,65.88,42.5,57.5C29.043,44.043,25.658,23.536,34.076,6.47c0.532-1.08,0.318-2.379-0.534-3.23  c-0.851-0.852-2.15-1.064-3.23-0.534c-4.918,2.427-9.375,5.619-13.246,9.491c-9.447,9.447-14.65,22.008-14.65,35.369  c0,13.36,5.203,25.921,14.65,35.368s22.008,14.65,35.368,14.65c13.361,0,25.921-5.203,35.369-14.65  c3.872-3.871,7.064-8.328,9.491-13.246C97.826,68.608,97.611,67.309,96.76,66.458z"})]})]}),"Darkmode");Darkmode.beforeDOMLoaded=darkmode_inline_default;Darkmode.css=darkmode_default;var Darkmode_default=__name(()=>Darkmode,"default");var readermode_inline_default=`var n=!1,d=t=>{let e=new CustomEvent("readermodechange",{detail:{mode:t}});document.dispatchEvent(e)};document.addEventListener("nav",()=>{let t=()=>{n=!n;let e=n?"on":"off";document.documentElement.setAttribute("reader-mode",e),d(e)};for(let e of document.getElementsByClassName("readermode"))e.addEventListener("click",t),window.addCleanup(()=>e.removeEventListener("click",t));document.documentElement.setAttribute("reader-mode",n?"on":"off")});
`;var readermode_default=`.readermode {
  cursor: pointer;
  padding: 0;
  position: relative;
  background: none;
  border: none;
  width: 20px;
  height: 20px;
  margin: 0;
  text-align: inherit;
  flex-shrink: 0;
}
.readermode svg {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  fill: var(--darkgray);
  stroke: var(--darkgray);
  transition: opacity 0.1s ease;
}

:root[reader-mode=on] .sidebar.left, :root[reader-mode=on] .sidebar.right {
  opacity: 0;
  transition: opacity 0.2s ease;
}
:root[reader-mode=on] .sidebar.left:hover, :root[reader-mode=on] .sidebar.right:hover {
  opacity: 1;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyJyZWFkZXJtb2RlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFLRjtFQUVFO0VBQ0E7O0FBRUE7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbIi5yZWFkZXJtb2RlIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgd2lkdGg6IDIwcHg7XG4gIGhlaWdodDogMjBweDtcbiAgbWFyZ2luOiAwO1xuICB0ZXh0LWFsaWduOiBpbmhlcml0O1xuICBmbGV4LXNocmluazogMDtcblxuICAmIHN2ZyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHdpZHRoOiAyMHB4O1xuICAgIGhlaWdodDogMjBweDtcbiAgICB0b3A6IGNhbGMoNTAlIC0gMTBweCk7XG4gICAgZmlsbDogdmFyKC0tZGFya2dyYXkpO1xuICAgIHN0cm9rZTogdmFyKC0tZGFya2dyYXkpO1xuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4xcyBlYXNlO1xuICB9XG59XG5cbjpyb290W3JlYWRlci1tb2RlPVwib25cIl0ge1xuICAmIC5zaWRlYmFyLmxlZnQsXG4gICYgLnNpZGViYXIucmlnaHQge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzIGVhc2U7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICB9XG59XG4iXX0= */`;import{jsx as jsx15,jsxs as jsxs8}from"preact/jsx-runtime";var ReaderMode=__name(({displayClass,cfg})=>jsx15("button",{class:classNames(displayClass,"readermode"),children:jsxs8("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"readerIcon",fill:"currentColor",stroke:"currentColor","stroke-width":"0.2","stroke-linecap":"round","stroke-linejoin":"round",width:"64px",height:"64px",viewBox:"0 0 24 24","aria-label":i18n(cfg.locale).components.readerMode.title,children:[jsx15("title",{children:i18n(cfg.locale).components.readerMode.title}),jsx15("g",{transform:"translate(-1.8, -1.8) scale(1.15, 1.2)",children:jsx15("path",{d:"M8.9891247,2.5 C10.1384702,2.5 11.2209868,2.96705384 12.0049645,3.76669482 C12.7883914,2.96705384 13.8709081,2.5 15.0202536,2.5 L18.7549359,2.5 C19.1691495,2.5 19.5049359,2.83578644 19.5049359,3.25 L19.5046891,4.004 L21.2546891,4.00457396 C21.6343849,4.00457396 21.9481801,4.28672784 21.9978425,4.6528034 L22.0046891,4.75457396 L22.0046891,20.25 C22.0046891,20.6296958 21.7225353,20.943491 21.3564597,20.9931534 L21.2546891,21 L2.75468914,21 C2.37499337,21 2.06119817,20.7178461 2.01153575,20.3517706 L2.00468914,20.25 L2.00468914,4.75457396 C2.00468914,4.37487819 2.28684302,4.061083 2.65291858,4.01142057 L2.75468914,4.00457396 L4.50368914,4.004 L4.50444233,3.25 C4.50444233,2.87030423 4.78659621,2.55650904 5.15267177,2.50684662 L5.25444233,2.5 L8.9891247,2.5 Z M4.50368914,5.504 L3.50468914,5.504 L3.50468914,19.5 L10.9478955,19.4998273 C10.4513189,18.9207296 9.73864328,18.5588115 8.96709342,18.5065584 L8.77307039,18.5 L5.25444233,18.5 C4.87474657,18.5 4.56095137,18.2178461 4.51128895,17.8517706 L4.50444233,17.75 L4.50368914,5.504 Z M19.5049359,17.75 C19.5049359,18.1642136 19.1691495,18.5 18.7549359,18.5 L15.2363079,18.5 C14.3910149,18.5 13.5994408,18.8724714 13.0614828,19.4998273 L20.5046891,19.5 L20.5046891,5.504 L19.5046891,5.504 L19.5049359,17.75 Z M18.0059359,3.999 L15.0202536,4 L14.8259077,4.00692283 C13.9889509,4.06666544 13.2254227,4.50975805 12.7549359,5.212 L12.7549359,17.777 L12.7782651,17.7601316 C13.4923805,17.2719483 14.3447024,17 15.2363079,17 L18.0059359,16.999 L18.0056891,4.798 L18.0033792,4.75457396 L18.0056891,4.71 L18.0059359,3.999 Z M8.9891247,4 L6.00368914,3.999 L6.00599909,4.75457396 L6.00599909,4.75457396 L6.00368914,4.783 L6.00368914,16.999 L8.77307039,17 C9.57551536,17 10.3461406,17.2202781 11.0128313,17.6202194 L11.2536891,17.776 L11.2536891,5.211 C10.8200889,4.56369974 10.1361548,4.13636104 9.37521067,4.02745763 L9.18347055,4.00692283 L8.9891247,4 Z"})})]})}),"ReaderMode");ReaderMode.beforeDOMLoaded=readermode_inline_default;ReaderMode.css=readermode_default;var DEFAULT_SANS_SERIF='system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',DEFAULT_MONO="ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace";function getFontSpecificationName(spec){return typeof spec=="string"?spec:spec.name}__name(getFontSpecificationName,"getFontSpecificationName");function formatFontSpecification(type,spec){typeof spec=="string"&&(spec={name:spec});let defaultIncludeWeights=type==="header"?[400,700]:[400,600],defaultIncludeItalic=type==="body",weights=spec.weights??defaultIncludeWeights,italic=spec.includeItalic??defaultIncludeItalic,features=[];if(italic&&features.push("ital"),weights.length>1){let weightSpec=italic?weights.flatMap(w=>[`0,${w}`,`1,${w}`]).sort().join(";"):weights.join(";");features.push(`wght@${weightSpec}`)}return features.length>0?`${spec.name}:${features.join(",")}`:spec.name}__name(formatFontSpecification,"formatFontSpecification");function googleFontHref(theme){let{header,body,code}=theme.typography,headerFont=formatFontSpecification("header",header),bodyFont=formatFontSpecification("body",body),codeFont=formatFontSpecification("code",code);return`https://fonts.googleapis.com/css2?family=${headerFont}&family=${bodyFont}&family=${codeFont}&display=swap`}__name(googleFontHref,"googleFontHref");function googleFontSubsetHref(theme,text){let title=theme.typography.title||theme.typography.header;return`https://fonts.googleapis.com/css2?family=${formatFontSpecification("title",title)}&text=${encodeURIComponent(text)}&display=swap`}__name(googleFontSubsetHref,"googleFontSubsetHref");var fontMimeMap={truetype:"ttf",woff:"woff",woff2:"woff2",opentype:"otf"};async function processGoogleFonts(stylesheet,baseUrl){let fontSourceRegex=/url\((https:\/\/fonts.gstatic.com\/.+(?:\/|(?:kit=))(.+?)[.&].+?)\)\sformat\('(\w+?)'\);/g,fontFiles=[],processedStylesheet=stylesheet,match;for(;(match=fontSourceRegex.exec(stylesheet))!==null;){let url=match[1],filename=match[2],extension=fontMimeMap[match[3].toLowerCase()],staticUrl=`https://${baseUrl}/static/fonts/${filename}.${extension}`;processedStylesheet=processedStylesheet.replace(url,staticUrl),fontFiles.push({url,filename,extension})}return{processedStylesheet,fontFiles}}__name(processGoogleFonts,"processGoogleFonts");function joinStyles(theme,...stylesheet){return`
${stylesheet.join(`

`)}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};
  --textHighlight: ${theme.colors.lightMode.textHighlight};

  --titleFont: "${getFontSpecificationName(theme.typography.title||theme.typography.header)}", ${DEFAULT_SANS_SERIF};
  --headerFont: "${getFontSpecificationName(theme.typography.header)}", ${DEFAULT_SANS_SERIF};
  --bodyFont: "${getFontSpecificationName(theme.typography.body)}", ${DEFAULT_SANS_SERIF};
  --codeFont: "${getFontSpecificationName(theme.typography.code)}", ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
  --textHighlight: ${theme.colors.darkMode.textHighlight};
}
`}__name(joinStyles,"joinStyles");import readingTime from"reading-time";import chalk5 from"chalk";import{jsx as jsx16,jsxs as jsxs9}from"preact/jsx-runtime";import sharp from"sharp";import satori from"satori";import path5 from"path";import fs2 from"fs";var write=__name(async({ctx,slug,ext,content})=>{let pathToPage=joinSegments(ctx.argv.output,slug+ext),dir=path5.dirname(pathToPage);return await fs2.promises.mkdir(dir,{recursive:!0}),await fs2.promises.writeFile(pathToPage,content),pathToPage},"write");import chalk6 from"chalk";import{Fragment as Fragment3,jsx as jsx17,jsxs as jsxs10}from"preact/jsx-runtime";var CustomOgImagesEmitterName="CustomOgImages";import{Fragment as Fragment4,jsx as jsx18,jsxs as jsxs11}from"preact/jsx-runtime";var Head_default=__name(()=>__name(({cfg,fileData,externalResources,ctx})=>{let titleSuffix=cfg.pageTitleSuffix??"",title=(fileData.frontmatter?.title??i18n(cfg.locale).propertyDefaults.title)+titleSuffix,description=fileData.frontmatter?.socialDescription??fileData.frontmatter?.description??unescapeHTML(fileData.description?.trim()??i18n(cfg.locale).propertyDefaults.description),{css,js,additionalHead}=externalResources,url=new URL(`https://${cfg.baseUrl??"example.com"}`),path12=url.pathname,baseDir=fileData.slug==="404"?path12:pathToRoot(fileData.slug),iconPath=joinSegments(baseDir,"static/icon.png"),socialUrl=fileData.slug==="404"?url.toString():joinSegments(url.toString(),fileData.slug),usesCustomOgImage=ctx.cfg.plugins.emitters.some(e=>e.name===CustomOgImagesEmitterName),ogImageDefaultPath=`https://${cfg.baseUrl}/static/og-image.png`;return jsxs11("head",{children:[jsx18("title",{children:title}),jsx18("meta",{charSet:"utf-8"}),cfg.theme.cdnCaching&&cfg.theme.fontOrigin==="googleFonts"&&jsxs11(Fragment4,{children:[jsx18("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),jsx18("link",{rel:"preconnect",href:"https://fonts.gstatic.com"}),jsx18("link",{rel:"stylesheet",href:googleFontHref(cfg.theme)}),cfg.theme.typography.title&&jsx18("link",{rel:"stylesheet",href:googleFontSubsetHref(cfg.theme,cfg.pageTitle)})]}),jsx18("link",{rel:"preconnect",href:"https://cdnjs.cloudflare.com",crossOrigin:"anonymous"}),jsx18("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),jsx18("meta",{name:"og:site_name",content:cfg.pageTitle}),jsx18("meta",{property:"og:title",content:title}),jsx18("meta",{property:"og:type",content:"website"}),jsx18("meta",{name:"twitter:card",content:"summary_large_image"}),jsx18("meta",{name:"twitter:title",content:title}),jsx18("meta",{name:"twitter:description",content:description}),jsx18("meta",{property:"og:description",content:description}),jsx18("meta",{property:"og:image:alt",content:description}),!usesCustomOgImage&&jsxs11(Fragment4,{children:[jsx18("meta",{property:"og:image",content:ogImageDefaultPath}),jsx18("meta",{property:"og:image:url",content:ogImageDefaultPath}),jsx18("meta",{name:"twitter:image",content:ogImageDefaultPath}),jsx18("meta",{property:"og:image:type",content:`image/${getFileExtension(ogImageDefaultPath)??"png"}`})]}),cfg.baseUrl&&jsxs11(Fragment4,{children:[jsx18("meta",{property:"twitter:domain",content:cfg.baseUrl}),jsx18("meta",{property:"og:url",content:socialUrl}),jsx18("meta",{property:"twitter:url",content:socialUrl})]}),jsx18("link",{rel:"icon",href:iconPath}),jsx18("meta",{name:"description",content:description}),jsx18("meta",{name:"generator",content:"Quartz"}),css.map(resource=>CSSResourceToStyleElement(resource,!0)),js.filter(resource=>resource.loadTime==="beforeDOMReady").map(res=>JSResourceToScriptElement(res,!0)),additionalHead.map(resource=>typeof resource=="function"?resource(fileData):resource)]})},"Head"),"default");import{jsx as jsx19}from"preact/jsx-runtime";var PageTitle=__name(({fileData,cfg,displayClass})=>{let title=cfg?.pageTitle??i18n(cfg.locale).propertyDefaults.title,baseDir=pathToRoot(fileData.slug);return jsx19("h2",{class:classNames(displayClass,"page-title"),children:jsx19("a",{href:baseDir,children:title})})},"PageTitle");PageTitle.css=`
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
`;var PageTitle_default=__name(()=>PageTitle,"default");import readingTime2 from"reading-time";var contentMeta_default=`.content-meta {
  margin-top: 0;
  color: var(--gray);
}
.content-meta[show-comma=true] > *:not(:last-child) {
  margin-right: 8px;
}
.content-meta[show-comma=true] > *:not(:last-child)::after {
  content: ",";
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyJjb250ZW50TWV0YS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTs7QUFHRTtFQUNFOztBQUVBO0VBQ0UiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGVudC1tZXRhIHtcbiAgbWFyZ2luLXRvcDogMDtcbiAgY29sb3I6IHZhcigtLWdyYXkpO1xuXG4gICZbc2hvdy1jb21tYT1cInRydWVcIl0ge1xuICAgID4gKjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgIG1hcmdpbi1yaWdodDogOHB4O1xuXG4gICAgICAmOjphZnRlciB7XG4gICAgICAgIGNvbnRlbnQ6IFwiLFwiO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19 */`;import{jsx as jsx20}from"preact/jsx-runtime";var defaultOptions11={showReadingTime:!0,showComma:!0},ContentMeta_default=__name(opts=>{let options2={...defaultOptions11,...opts};function ContentMetadata({cfg,fileData,displayClass}){let text=fileData.text;if(text){let segments=[];if(fileData.dates&&segments.push(jsx20(Date2,{date:getDate(cfg,fileData),locale:cfg.locale})),options2.showReadingTime){let{minutes,words:_words}=readingTime2(text),displayedTime=i18n(cfg.locale).components.contentMeta.readingTime({minutes:Math.ceil(minutes)});segments.push(jsx20("span",{children:displayedTime}))}return jsx20("p",{"show-comma":options2.showComma,class:classNames(displayClass,"content-meta"),children:segments})}else return null}return __name(ContentMetadata,"ContentMetadata"),ContentMetadata.css=contentMeta_default,ContentMetadata},"default");import{jsx as jsx21}from"preact/jsx-runtime";function Spacer({displayClass}){return jsx21("div",{class:classNames(displayClass,"spacer")})}__name(Spacer,"Spacer");var Spacer_default=__name(()=>Spacer,"default");import{jsx as jsx22,jsxs as jsxs12}from"preact/jsx-runtime";import{jsx as jsx23,jsxs as jsxs13}from"preact/jsx-runtime";import{jsx as jsx24,jsxs as jsxs14}from"preact/jsx-runtime";import{jsx as jsx25}from"preact/jsx-runtime";var TagList=__name(({fileData,displayClass})=>{let tags=fileData.frontmatter?.tags;return tags&&tags.length>0?jsx25("ul",{class:classNames(displayClass,"tags"),children:tags.map(tag=>{let linkDest=resolveRelative(fileData.slug,`tags/${tag}`);return jsx25("li",{children:jsx25("a",{href:linkDest,class:"internal tag-link",children:tag})})})}):null},"TagList");TagList.css=`
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`;var TagList_default=__name(()=>TagList,"default");import{jsx as jsx26,jsxs as jsxs15}from"preact/jsx-runtime";import{jsx as jsx27,jsxs as jsxs16}from"preact/jsx-runtime";var search_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
.search {
  min-width: fit-content;
  max-width: 14rem;
}
@media all and ((max-width: 800px)) {
  .search {
    flex-grow: 0.3;
  }
}
.search > .search-button {
  background-color: var(--lightgray);
  border: none;
  border-radius: 4px;
  font-family: inherit;
  font-size: inherit;
  height: 2rem;
  padding: 0;
  display: flex;
  align-items: center;
  text-align: inherit;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
  justify-content: space-between;
}
.search > .search-button > p {
  display: inline;
  padding: 0 1rem;
}
.search > .search-button svg {
  cursor: pointer;
  width: 18px;
  min-width: 18px;
  margin: 0 0.5rem;
}
.search > .search-button svg .search-path {
  stroke: var(--darkgray);
  stroke-width: 2px;
  transition: stroke 0.5s ease;
}
.search > .search-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  display: none;
  backdrop-filter: blur(4px);
}
.search > .search-container.active {
  display: inline-block;
}
.search > .search-container > .search-space {
  width: 65%;
  margin-top: 12vh;
  margin-left: auto;
  margin-right: auto;
}
@media all and not ((min-width: 1200px)) {
  .search > .search-container > .search-space {
    width: 90%;
  }
}
.search > .search-container > .search-space > * {
  width: 100%;
  border-radius: 7px;
  background: var(--light);
  box-shadow: 0 14px 50px rgba(27, 33, 48, 0.12), 0 10px 30px rgba(27, 33, 48, 0.16);
  margin-bottom: 2em;
}
.search > .search-container > .search-space > input {
  box-sizing: border-box;
  padding: 0.5em 1em;
  font-family: var(--bodyFont);
  color: var(--dark);
  font-size: 1.1em;
  border: 1px solid var(--lightgray);
}
.search > .search-container > .search-space > input:focus {
  outline: none;
}
.search > .search-container > .search-space > .search-layout {
  display: none;
  flex-direction: row;
  border: 1px solid var(--lightgray);
  flex: 0 0 100%;
  box-sizing: border-box;
}
.search > .search-container > .search-space > .search-layout.display-results {
  display: flex;
}
.search > .search-container > .search-space > .search-layout[data-preview] > .results-container {
  flex: 0 0 min(30%, 450px);
}
@media all and not ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout[data-preview] .result-card > p.preview {
    display: none;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > div:first-child {
    border-right: 1px solid var(--lightgray);
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > div:last-child {
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
  }
}
.search > .search-container > .search-space > .search-layout > div {
  height: 63vh;
  border-radius: 5px;
}
@media all and ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout {
    flex-direction: column;
  }
  .search > .search-container > .search-space > .search-layout > .preview-container {
    display: none !important;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > .results-container {
    width: 100%;
    height: auto;
    flex: 0 0 100%;
  }
}
.search > .search-container > .search-space > .search-layout .highlight {
  background: color-mix(in srgb, var(--tertiary) 60%, rgba(255, 255, 255, 0));
  border-radius: 5px;
  scroll-margin-top: 2rem;
}
.search > .search-container > .search-space > .search-layout > .preview-container {
  flex-grow: 1;
  display: block;
  overflow: hidden;
  font-family: inherit;
  color: var(--dark);
  line-height: 1.5em;
  font-weight: 400;
  overflow-y: auto;
  padding: 0 2rem;
}
.search > .search-container > .search-space > .search-layout > .preview-container .preview-inner {
  margin: 0 auto;
  width: min(800px, 100%);
}
.search > .search-container > .search-space > .search-layout > .preview-container a[role=anchor] {
  background-color: transparent;
}
.search > .search-container > .search-space > .search-layout > .results-container {
  overflow-y: auto;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card {
  overflow: hidden;
  padding: 1em;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid var(--lightgray);
  width: 100%;
  display: block;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-transform: none;
  text-align: left;
  outline: none;
  font-weight: inherit;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card:hover, .search > .search-container > .search-space > .search-layout > .results-container .result-card:focus, .search > .search-container > .search-space > .search-layout > .results-container .result-card.focus {
  background: var(--lightgray);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > h3 {
  margin: 0;
}
@media all and not ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout > .results-container .result-card > p.card-description {
    display: none;
  }
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul.tags {
  margin-top: 0.45rem;
  margin-bottom: 0;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul > li > p {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
  line-height: 1.4rem;
  font-weight: 700;
  color: var(--secondary);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul > li > p.match-tag {
  color: var(--tertiary);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > p {
  margin-bottom: 0;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3MiLCJzZWFyY2guc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQ0FBO0VBQ0U7RUFDQTs7QUFDQTtFQUhGO0lBSUk7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQU5GO0lBT0k7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0EsWUFDRTtFQUVGOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTs7QUFHRjtFQUVJO0lBQ0U7O0VBSUE7SUFDRTtJQUNBO0lBQ0E7O0VBR0Y7SUFDRTtJQUNBOzs7QUFNUjtFQUNFO0VBQ0E7O0FBR0Y7RUF6Q0Y7SUEwQ0k7O0VBRUE7SUFDRTs7RUFHRjtJQUNFO0lBQ0E7SUFDQTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxhRDFJSztFQzJJTDtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUNFOztBQUlKO0VBQ0U7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBR0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUdFOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtJQUNFOzs7QUFJSjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsYUQ1TUQ7RUM2TUM7O0FBRUE7RUFDRTs7QUFJSjtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcInNhc3M6bWFwXCI7XG5cbi8qKlxuICogTGF5b3V0IGJyZWFrcG9pbnRzXG4gKiAkbW9iaWxlOiBzY3JlZW4gd2lkdGggYmVsb3cgdGhpcyB2YWx1ZSB3aWxsIHVzZSBtb2JpbGUgc3R5bGVzXG4gKiAkZGVza3RvcDogc2NyZWVuIHdpZHRoIGFib3ZlIHRoaXMgdmFsdWUgd2lsbCB1c2UgZGVza3RvcCBzdHlsZXNcbiAqIFNjcmVlbiB3aWR0aCBiZXR3ZWVuICRtb2JpbGUgYW5kICRkZXNrdG9wIHdpZHRoIHdpbGwgdXNlIHRoZSB0YWJsZXQgbGF5b3V0LlxuICogYXNzdW1pbmcgbW9iaWxlIDwgZGVza3RvcFxuICovXG4kYnJlYWtwb2ludHM6IChcbiAgbW9iaWxlOiA4MDBweCxcbiAgZGVza3RvcDogMTIwMHB4LFxuKTtcblxuJG1vYmlsZTogXCIobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSlcIjtcbiR0YWJsZXQ6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pIGFuZCAobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG4kZGVza3RvcDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG5cbiRwYWdlV2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9O1xuJHNpZGVQYW5lbFdpZHRoOiAzMjBweDsgLy8zODBweDtcbiR0b3BTcGFjaW5nOiA2cmVtO1xuJGJvbGRXZWlnaHQ6IDcwMDtcbiRzZW1pQm9sZFdlaWdodDogNjAwO1xuJG5vcm1hbFdlaWdodDogNDAwO1xuXG4kbW9iaWxlR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCJhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0XCJcXFxuICAgICAgXCJncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1mb290ZXJcIicsXG4pO1xuJHRhYmxldEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlclwiJyxcbik7XG4kZGVza3RvcEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0byAjeyRzaWRlUGFuZWxXaWR0aH1cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyIGdyaWQtc2lkZWJhci1yaWdodFwiJyxcbik7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcblxuLnNlYXJjaCB7XG4gIG1pbi13aWR0aDogZml0LWNvbnRlbnQ7XG4gIG1heC13aWR0aDogMTRyZW07XG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgZmxleC1ncm93OiAwLjM7XG4gIH1cblxuICAmID4gLnNlYXJjaC1idXR0b24ge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDtcbiAgICBmb250LXNpemU6IGluaGVyaXQ7XG4gICAgaGVpZ2h0OiAycmVtO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHRleHQtYWxpZ246IGluaGVyaXQ7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXG4gICAgJiA+IHAge1xuICAgICAgZGlzcGxheTogaW5saW5lO1xuICAgICAgcGFkZGluZzogMCAxcmVtO1xuICAgIH1cblxuICAgICYgc3ZnIHtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIHdpZHRoOiAxOHB4O1xuICAgICAgbWluLXdpZHRoOiAxOHB4O1xuICAgICAgbWFyZ2luOiAwIDAuNXJlbTtcblxuICAgICAgLnNlYXJjaC1wYXRoIHtcbiAgICAgICAgc3Ryb2tlOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgICAgIHN0cm9rZS13aWR0aDogMnB4O1xuICAgICAgICB0cmFuc2l0aW9uOiBzdHJva2UgMC41cyBlYXNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICYgPiAuc2VhcmNoLWNvbnRhaW5lciB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGNvbnRhaW46IGxheW91dDtcbiAgICB6LWluZGV4OiA5OTk7XG4gICAgbGVmdDogMDtcbiAgICB0b3A6IDA7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xuXG4gICAgJi5hY3RpdmUge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIH1cblxuICAgICYgPiAuc2VhcmNoLXNwYWNlIHtcbiAgICAgIHdpZHRoOiA2NSU7XG4gICAgICBtYXJnaW4tdG9wOiAxMnZoO1xuICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG5cbiAgICAgIEBtZWRpYSBhbGwgYW5kIG5vdCAoJGRlc2t0b3ApIHtcbiAgICAgICAgd2lkdGg6IDkwJTtcbiAgICAgIH1cblxuICAgICAgJiA+ICoge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogN3B4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodCk7XG4gICAgICAgIGJveC1zaGFkb3c6XG4gICAgICAgICAgMCAxNHB4IDUwcHggcmdiYSgyNywgMzMsIDQ4LCAwLjEyKSxcbiAgICAgICAgICAwIDEwcHggMzBweCByZ2JhKDI3LCAzMywgNDgsIDAuMTYpO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAyZW07XG4gICAgICB9XG5cbiAgICAgICYgPiBpbnB1dCB7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIHBhZGRpbmc6IDAuNWVtIDFlbTtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcigtLWJvZHlGb250KTtcbiAgICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICAgICBmb250LXNpemU6IDEuMWVtO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuXG4gICAgICAgICY6Zm9jdXMge1xuICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJiA+IC5zZWFyY2gtbGF5b3V0IHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgZmxleDogMCAwIDEwMCU7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgICAgICAgJi5kaXNwbGF5LXJlc3VsdHMge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIH1cblxuICAgICAgICAmW2RhdGEtcHJldmlld10gPiAucmVzdWx0cy1jb250YWluZXIge1xuICAgICAgICAgIGZsZXg6IDAgMCBtaW4oMzAlLCA0NTBweCk7XG4gICAgICAgIH1cblxuICAgICAgICBAbWVkaWEgYWxsIGFuZCBub3QgKCRtb2JpbGUpIHtcbiAgICAgICAgICAmW2RhdGEtcHJldmlld10ge1xuICAgICAgICAgICAgJiAucmVzdWx0LWNhcmQgPiBwLnByZXZpZXcge1xuICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gZGl2IHtcbiAgICAgICAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogdW5zZXQ7XG4gICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IHVuc2V0O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiB1bnNldDtcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiB1bnNldDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYgPiBkaXYge1xuICAgICAgICAgIGhlaWdodDogY2FsYyg3NXZoIC0gMTJ2aCk7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgICAgICAgJiA+IC5wcmV2aWV3LWNvbnRhaW5lciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJltkYXRhLXByZXZpZXddID4gLnJlc3VsdHMtY29udGFpbmVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiBhdXRvO1xuICAgICAgICAgICAgZmxleDogMCAwIDEwMCU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJiAuaGlnaGxpZ2h0IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tdGVydGlhcnkpIDYwJSwgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSk7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICAgIHNjcm9sbC1tYXJnaW4tdG9wOiAycmVtO1xuICAgICAgICB9XG5cbiAgICAgICAgJiA+IC5wcmV2aWV3LWNvbnRhaW5lciB7XG4gICAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjVlbTtcbiAgICAgICAgICBmb250LXdlaWdodDogJG5vcm1hbFdlaWdodDtcbiAgICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgICAgIHBhZGRpbmc6IDAgMnJlbTtcblxuICAgICAgICAgICYgLnByZXZpZXctaW5uZXIge1xuICAgICAgICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgICAgICAgICB3aWR0aDogbWluKCRwYWdlV2lkdGgsIDEwMCUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFbcm9sZT1cImFuY2hvclwiXSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmID4gLnJlc3VsdHMtY29udGFpbmVyIHtcbiAgICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuXG4gICAgICAgICAgJiAucmVzdWx0LWNhcmQge1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHBhZGRpbmc6IDFlbTtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycyBlYXNlO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcblxuICAgICAgICAgICAgLy8gbm9ybWFsaXplIGNhcmQgcHJvcHNcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMDAlO1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTU7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XG5cbiAgICAgICAgICAgICY6aG92ZXIsXG4gICAgICAgICAgICAmOmZvY3VzLFxuICAgICAgICAgICAgJi5mb2N1cyB7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYgPiBoMyB7XG4gICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQG1lZGlhIGFsbCBhbmQgbm90ICgkbW9iaWxlKSB7XG4gICAgICAgICAgICAgICYgPiBwLmNhcmQtZGVzY3JpcHRpb24ge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJiA+IHVsLnRhZ3Mge1xuICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjQ1cmVtO1xuICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gdWwgPiBsaSA+IHAge1xuICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhpZ2hsaWdodCk7XG4gICAgICAgICAgICAgIHBhZGRpbmc6IDAuMnJlbSAwLjRyZW07XG4gICAgICAgICAgICAgIG1hcmdpbjogMCAwLjFyZW07XG4gICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjRyZW07XG4gICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAkYm9sZFdlaWdodDtcbiAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG5cbiAgICAgICAgICAgICAgJi5tYXRjaC10YWcge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJiA+IHAge1xuICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19 */`;var search_inline_default='var Gt=Object.create;var Ft=Object.defineProperty;var Jt=Object.getOwnPropertyDescriptor;var Vt=Object.getOwnPropertyNames;var bt=Object.getPrototypeOf,Zt=Object.prototype.hasOwnProperty;var ht=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Qt=(t,e,u,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Vt(e))!Zt.call(t,r)&&r!==u&&Ft(t,r,{get:()=>e[r],enumerable:!(n=Jt(e,r))||n.enumerable});return t};var Xt=(t,e,u)=>(u=t!=null?Gt(bt(t)):{},Qt(e||!t||!t.__esModule?Ft(u,"default",{value:t,enumerable:!0}):u,t));var ft=ht(()=>{});var It=ht((qe,Ot)=>{"use strict";Ot.exports=de;function z(t){return t instanceof Buffer?Buffer.from(t):new t.constructor(t.buffer.slice(),t.byteOffset,t.length)}function de(t){if(t=t||{},t.circles)return Ce(t);let e=new Map;if(e.set(Date,s=>new Date(s)),e.set(Map,(s,l)=>new Map(n(Array.from(s),l))),e.set(Set,(s,l)=>new Set(n(Array.from(s),l))),t.constructorHandlers)for(let s of t.constructorHandlers)e.set(s[0],s[1]);let u=null;return t.proto?i:r;function n(s,l){let o=Object.keys(s),D=new Array(o.length);for(let h=0;h<o.length;h++){let c=o[h],f=s[c];typeof f!="object"||f===null?D[c]=f:f.constructor!==Object&&(u=e.get(f.constructor))?D[c]=u(f,l):ArrayBuffer.isView(f)?D[c]=z(f):D[c]=l(f)}return D}function r(s){if(typeof s!="object"||s===null)return s;if(Array.isArray(s))return n(s,r);if(s.constructor!==Object&&(u=e.get(s.constructor)))return u(s,r);let l={};for(let o in s){if(Object.hasOwnProperty.call(s,o)===!1)continue;let D=s[o];typeof D!="object"||D===null?l[o]=D:D.constructor!==Object&&(u=e.get(D.constructor))?l[o]=u(D,r):ArrayBuffer.isView(D)?l[o]=z(D):l[o]=r(D)}return l}function i(s){if(typeof s!="object"||s===null)return s;if(Array.isArray(s))return n(s,i);if(s.constructor!==Object&&(u=e.get(s.constructor)))return u(s,i);let l={};for(let o in s){let D=s[o];typeof D!="object"||D===null?l[o]=D:D.constructor!==Object&&(u=e.get(D.constructor))?l[o]=u(D,i):ArrayBuffer.isView(D)?l[o]=z(D):l[o]=i(D)}return l}}function Ce(t){let e=[],u=[],n=new Map;if(n.set(Date,o=>new Date(o)),n.set(Map,(o,D)=>new Map(i(Array.from(o),D))),n.set(Set,(o,D)=>new Set(i(Array.from(o),D))),t.constructorHandlers)for(let o of t.constructorHandlers)n.set(o[0],o[1]);let r=null;return t.proto?l:s;function i(o,D){let h=Object.keys(o),c=new Array(h.length);for(let f=0;f<h.length;f++){let a=h[f],F=o[a];if(typeof F!="object"||F===null)c[a]=F;else if(F.constructor!==Object&&(r=n.get(F.constructor)))c[a]=r(F,D);else if(ArrayBuffer.isView(F))c[a]=z(F);else{let g=e.indexOf(F);g!==-1?c[a]=u[g]:c[a]=D(F)}}return c}function s(o){if(typeof o!="object"||o===null)return o;if(Array.isArray(o))return i(o,s);if(o.constructor!==Object&&(r=n.get(o.constructor)))return r(o,s);let D={};e.push(o),u.push(D);for(let h in o){if(Object.hasOwnProperty.call(o,h)===!1)continue;let c=o[h];if(typeof c!="object"||c===null)D[h]=c;else if(c.constructor!==Object&&(r=n.get(c.constructor)))D[h]=r(c,s);else if(ArrayBuffer.isView(c))D[h]=z(c);else{let f=e.indexOf(c);f!==-1?D[h]=u[f]:D[h]=s(c)}}return e.pop(),u.pop(),D}function l(o){if(typeof o!="object"||o===null)return o;if(Array.isArray(o))return i(o,l);if(o.constructor!==Object&&(r=n.get(o.constructor)))return r(o,l);let D={};e.push(o),u.push(D);for(let h in o){let c=o[h];if(typeof c!="object"||c===null)D[h]=c;else if(c.constructor!==Object&&(r=n.get(c.constructor)))D[h]=r(c,l);else if(ArrayBuffer.isView(c))D[h]=z(c);else{let f=e.indexOf(c);f!==-1?D[h]=u[f]:D[h]=l(c)}}return e.pop(),u.pop(),D}}});var B;function Y(t){return typeof t<"u"?t:!0}function at(t){let e=Array(t);for(let u=0;u<t;u++)e[u]=p();return e}function p(){return Object.create(null)}function Yt(t,e){return e.length-t.length}function w(t){return typeof t=="string"}function H(t){return typeof t=="object"}function ot(t){return typeof t=="function"}function pt(t,e){var u=te;if(t&&(e&&(t=tt(t,e)),this.H&&(t=tt(t,this.H)),this.J&&1<t.length&&(t=tt(t,this.J)),u||u==="")){if(e=t.split(u),this.filter){t=this.filter,u=e.length;let n=[];for(let r=0,i=0;r<u;r++){let s=e[r];s&&!t[s]&&(n[i++]=s)}t=n}else t=e;return t}return t}var te=/[\\p{Z}\\p{S}\\p{P}\\p{C}]+/u,ee=/[\\u0300-\\u036f]/g;function Et(t,e){let u=Object.keys(t),n=u.length,r=[],i="",s=0;for(let l=0,o,D;l<n;l++)o=u[l],(D=t[o])?(r[s++]=y(e?"(?!\\\\b)"+o+"(\\\\b|_)":o),r[s++]=D):i+=(i?"|":"")+o;return i&&(r[s++]=y(e?"(?!\\\\b)("+i+")(\\\\b|_)":"("+i+")"),r[s]=""),r}function tt(t,e){for(let u=0,n=e.length;u<n&&(t=t.replace(e[u],e[u+1]),t);u+=2);return t}function y(t){return new RegExp(t,"g")}function mt(t){let e="",u="";for(let n=0,r=t.length,i;n<r;n++)(i=t[n])!==u&&(e+=u=i);return e}var ue={encode:Bt,F:!1,G:""};function Bt(t){return pt.call(this,(""+t).toLowerCase(),!1)}var yt={},U={};function xt(t){K(t,"add"),K(t,"append"),K(t,"search"),K(t,"update"),K(t,"remove")}function K(t,e){t[e+"Async"]=function(){let u=this,n=arguments;var r=n[n.length-1];let i;return ot(r)&&(i=r,delete n[n.length-1]),r=new Promise(function(s){setTimeout(function(){u.async=!0;let l=u[e].apply(u,n);u.async=!1,s(l)})}),i?(r.then(i),this):r}}function wt(t,e,u,n){let r=t.length,i=[],s,l,o=0;n&&(n=[]);for(let D=r-1;0<=D;D--){let h=t[D],c=h.length,f=p(),a=!s;for(let F=0;F<c;F++){let g=h[F],A=g.length;if(A)for(let k=0,v,x;k<A;k++)if(x=g[k],s){if(s[x]){if(!D){if(u)u--;else if(i[o++]=x,o===e)return i}(D||n)&&(f[x]=1),a=!0}if(n&&(v=(l[x]||0)+1,l[x]=v,v<r)){let R=n[v-2]||(n[v-2]=[]);R[R.length]=x}}else f[x]=1}if(n)s||(l=f);else if(!a)return[];s=f}if(n)for(let D=n.length-1,h,c;0<=D;D--){h=n[D],c=h.length;for(let f=0,a;f<c;f++)if(a=h[f],!s[a]){if(u)u--;else if(i[o++]=a,o===e)return i;s[a]=1}}return i}function ne(t,e){let u=p(),n=p(),r=[];for(let i=0;i<t.length;i++)u[t[i]]=1;for(let i=0,s;i<e.length;i++){s=e[i];for(let l=0,o;l<s.length;l++)o=s[l],u[o]&&!n[o]&&(n[o]=1,r[r.length]=o)}return r}function ut(t){this.l=t!==!0&&t,this.cache=p(),this.h=[]}function vt(t,e,u){H(t)&&(t=t.query);let n=this.cache.get(t);return n||(n=this.search(t,e,u),this.cache.set(t,n)),n}ut.prototype.set=function(t,e){if(!this.cache[t]){var u=this.h.length;for(u===this.l?delete this.cache[this.h[u-1]]:u++,--u;0<u;u--)this.h[u]=this.h[u-1];this.h[0]=t}this.cache[t]=e};ut.prototype.get=function(t){let e=this.cache[t];if(this.l&&e&&(t=this.h.indexOf(t))){let u=this.h[t-1];this.h[t-1]=this.h[t],this.h[t]=u}return e};var re={memory:{charset:"latin:extra",D:3,B:4,m:!1},performance:{D:3,B:3,s:!1,context:{depth:2,D:1}},match:{charset:"latin:extra",G:"reverse"},score:{charset:"latin:advanced",D:20,B:3,context:{depth:3,D:9}},default:{}};function Lt(t,e,u,n,r,i,s,l){setTimeout(function(){let o=t(u?u+"."+n:n,JSON.stringify(s));o&&o.then?o.then(function(){e.export(t,e,u,r,i+1,l)}):e.export(t,e,u,r,i+1,l)})}function P(t,e){if(!(this instanceof P))return new P(t);var u;if(t){w(t)?t=re[t]:(u=t.preset)&&(t=Object.assign({},u[u],t)),u=t.charset;var n=t.lang;w(u)&&(u.indexOf(":")===-1&&(u+=":default"),u=U[u]),w(n)&&(n=yt[n])}else t={};let r,i,s=t.context||{};if(this.encode=t.encode||u&&u.encode||Bt,this.register=e||p(),this.D=r=t.resolution||9,this.G=e=u&&u.G||t.tokenize||"strict",this.depth=e==="strict"&&s.depth,this.l=Y(s.bidirectional),this.s=i=Y(t.optimize),this.m=Y(t.fastupdate),this.B=t.minlength||1,this.C=t.boost,this.map=i?at(r):p(),this.A=r=s.resolution||1,this.h=i?at(r):p(),this.F=u&&u.F||t.rtl,this.H=(e=t.matcher||n&&n.H)&&Et(e,!1),this.J=(e=t.stemmer||n&&n.J)&&Et(e,!0),u=e=t.filter||n&&n.filter){u=e,n=p();for(let l=0,o=u.length;l<o;l++)n[u[l]]=1;u=n}this.filter=u,this.cache=(e=t.cache)&&new ut(e)}B=P.prototype;B.append=function(t,e){return this.add(t,e,!0)};B.add=function(t,e,u,n){if(e&&(t||t===0)){if(!n&&!u&&this.register[t])return this.update(t,e);if(e=this.encode(e),n=e.length){let D=p(),h=p(),c=this.depth,f=this.D;for(let a=0;a<n;a++){let F=e[this.F?n-1-a:a];var r=F.length;if(F&&r>=this.B&&(c||!h[F])){var i=Q(f,n,a),s="";switch(this.G){case"full":if(2<r){for(i=0;i<r;i++)for(var l=r;l>i;l--)if(l-i>=this.B){var o=Q(f,n,a,r,i);s=F.substring(i,l),$(this,h,s,o,t,u)}break}case"reverse":if(1<r){for(l=r-1;0<l;l--)s=F[l]+s,s.length>=this.B&&$(this,h,s,Q(f,n,a,r,l),t,u);s=""}case"forward":if(1<r){for(l=0;l<r;l++)s+=F[l],s.length>=this.B&&$(this,h,s,i,t,u);break}default:if(this.C&&(i=Math.min(i/this.C(e,F,a)|0,f-1)),$(this,h,F,i,t,u),c&&1<n&&a<n-1){for(r=p(),s=this.A,i=F,l=Math.min(c+1,n-a),r[i]=1,o=1;o<l;o++)if((F=e[this.F?n-1-a-o:a+o])&&F.length>=this.B&&!r[F]){r[F]=1;let g=this.l&&F>i;$(this,D,g?i:F,Q(s+(n/2>s?0:1),n,a,l-1,o-1),t,u,g?F:i)}}}}}this.m||(this.register[t]=1)}}return this};function Q(t,e,u,n,r){return u&&1<t?e+(n||0)<=t?u+(r||0):(t-1)/(e+(n||0))*(u+(r||0))+1|0:0}function $(t,e,u,n,r,i,s){let l=s?t.h:t.map;(!e[u]||s&&!e[u][s])&&(t.s&&(l=l[n]),s?(e=e[u]||(e[u]=p()),e[s]=1,l=l[s]||(l[s]=p())):e[u]=1,l=l[u]||(l[u]=[]),t.s||(l=l[n]||(l[n]=[])),i&&l.includes(r)||(l[l.length]=r,t.m&&(t=t.register[r]||(t.register[r]=[]),t[t.length]=l)))}B.search=function(t,e,u){u||(!e&&H(t)?(u=t,t=u.query):H(e)&&(u=e));let n=[],r,i,s=0;if(u){t=u.query||t,e=u.limit,s=u.offset||0;var l=u.context;i=u.suggest}if(t&&(t=this.encode(""+t),r=t.length,1<r)){u=p();var o=[];for(let h=0,c=0,f;h<r;h++)if((f=t[h])&&f.length>=this.B&&!u[f])if(this.s||i||this.map[f])o[c++]=f,u[f]=1;else return n;t=o,r=t.length}if(!r)return n;e||(e=100),l=this.depth&&1<r&&l!==!1,u=0;let D;l?(D=t[0],u=1):1<r&&t.sort(Yt);for(let h,c;u<r;u++){if(c=t[u],l?(h=gt(this,n,i,e,s,r===2,c,D),i&&h===!1&&n.length||(D=c)):h=gt(this,n,i,e,s,r===1,c),h)return h;if(i&&u===r-1){if(o=n.length,!o){if(l){l=0,u=-1;continue}return n}if(o===1)return St(n[0],e,s)}}return wt(n,e,s,i)};function gt(t,e,u,n,r,i,s,l){let o=[],D=l?t.h:t.map;if(t.s||(D=dt(D,s,l,t.l)),D){let h=0,c=Math.min(D.length,l?t.A:t.D);for(let f=0,a=0,F,g;f<c&&!((F=D[f])&&(t.s&&(F=dt(F,s,l,t.l)),r&&F&&i&&(g=F.length,g<=r?(r-=g,F=null):(F=F.slice(r),r=0)),F&&(o[h++]=F,i&&(a+=F.length,a>=n))));f++);if(h){if(i)return St(o,n,0);e[e.length]=o;return}}return!u&&o}function St(t,e,u){return t=t.length===1?t[0]:[].concat.apply([],t),u||t.length>e?t.slice(u,u+e):t}function dt(t,e,u,n){return u?(n=n&&e>u,t=(t=t[n?e:u])&&t[n?u:e]):t=t[e],t}B.contain=function(t){return!!this.register[t]};B.update=function(t,e){return this.remove(t).add(t,e)};B.remove=function(t,e){let u=this.register[t];if(u){if(this.m)for(let n=0,r;n<u.length;n++)r=u[n],r.splice(r.indexOf(t),1);else et(this.map,t,this.D,this.s),this.depth&&et(this.h,t,this.A,this.s);if(e||delete this.register[t],this.cache){e=this.cache;for(let n=0,r,i;n<e.h.length;n++)i=e.h[n],r=e.cache[i],r.includes(t)&&(e.h.splice(n--,1),delete e.cache[i])}}return this};function et(t,e,u,n,r){let i=0;if(t.constructor===Array)if(r)e=t.indexOf(e),e!==-1?1<t.length&&(t.splice(e,1),i++):i++;else{r=Math.min(t.length,u);for(let s=0,l;s<r;s++)(l=t[s])&&(i=et(l,e,u,n,r),n||i||delete t[s])}else for(let s in t)(i=et(t[s],e,u,n,r))||delete t[s];return i}B.searchCache=vt;B.export=function(t,e,u,n,r,i){let s=!0;typeof i>"u"&&(s=new Promise(D=>{i=D}));let l,o;switch(r||(r=0)){case 0:if(l="reg",this.m){o=p();for(let D in this.register)o[D]=1}else o=this.register;break;case 1:l="cfg",o={doc:0,opt:this.s?1:0};break;case 2:l="map",o=this.map;break;case 3:l="ctx",o=this.h;break;default:typeof u>"u"&&i&&i();return}return Lt(t,e||this,u,l,n,r,o,i),s};B.import=function(t,e){if(e)switch(w(e)&&(e=JSON.parse(e)),t){case"cfg":this.s=!!e.opt;break;case"reg":this.m=!1,this.register=e;break;case"map":this.map=e;break;case"ctx":this.h=e}};xt(P.prototype);function ie(t){t=t.data;var e=self._index;let u=t.args;var n=t.task;switch(n){case"init":n=t.options||{},t=t.factory,e=n.encode,n.cache=!1,e&&e.indexOf("function")===0&&(n.encode=Function("return "+e)()),t?(Function("return "+t)()(self),self._index=new self.FlexSearch.Index(n),delete self.FlexSearch):self._index=new P(n);break;default:t=t.id,e=e[n].apply(e,u),postMessage(n==="search"?{id:t,msg:e}:{id:t})}}var Ct=0;function q(t){if(!(this instanceof q))return new q(t);var e;t?ot(e=t.encode)&&(t.encode=e.toString()):t={},(e=(self||window)._factory)&&(e=e.toString());let u=typeof window>"u"&&self.exports,n=this;this.o=se(e,u,t.worker),this.h=p(),this.o&&(u?this.o.on("message",function(r){n.h[r.id](r.msg),delete n.h[r.id]}):this.o.onmessage=function(r){r=r.data,n.h[r.id](r.msg),delete n.h[r.id]},this.o.postMessage({task:"init",factory:e,options:t}))}J("add");J("append");J("search");J("update");J("remove");function J(t){q.prototype[t]=q.prototype[t+"Async"]=function(){let e=this,u=[].slice.call(arguments);var n=u[u.length-1];let r;return ot(n)&&(r=n,u.splice(u.length-1,1)),n=new Promise(function(i){setTimeout(function(){e.h[++Ct]=i,e.o.postMessage({task:t,id:Ct,args:u})})}),r?(n.then(r),this):n}}function se(t,e,u){let n;try{n=e?new(ft()).Worker(__dirname+"/node/node.js"):t?new Worker(URL.createObjectURL(new Blob(["onmessage="+ie.toString()],{type:"text/javascript"}))):new Worker(w(u)?u:"worker/worker.js",{type:"module"})}catch{}return n}function G(t){if(!(this instanceof G))return new G(t);var e=t.document||t.doc||t,u;this.K=[],this.h=[],this.A=[],this.register=p(),this.key=(u=e.key||e.id)&&X(u,this.A)||"id",this.m=Y(t.fastupdate),this.C=(u=e.store)&&u!==!0&&[],this.store=u&&p(),this.I=(u=e.tag)&&X(u,this.A),this.l=u&&p(),this.cache=(u=t.cache)&&new ut(u),t.cache=!1,this.o=t.worker,this.async=!1,u=p();let n=e.index||e.field||e;w(n)&&(n=[n]);for(let r=0,i,s;r<n.length;r++)i=n[r],w(i)||(s=i,i=i.field),s=H(s)?Object.assign({},t,s):t,this.o&&(u[i]=new q(s),u[i].o||(this.o=!1)),this.o||(u[i]=new P(s,this.register)),this.K[r]=X(i,this.A),this.h[r]=i;if(this.C)for(t=e.store,w(t)&&(t=[t]),e=0;e<t.length;e++)this.C[e]=X(t[e],this.A);this.index=u}function X(t,e){let u=t.split(":"),n=0;for(let r=0;r<u.length;r++)t=u[r],0<=t.indexOf("[]")&&(t=t.substring(0,t.length-2))&&(e[n]=!0),t&&(u[n++]=t);return n<u.length&&(u.length=n),1<n?u:u[0]}function it(t,e){if(w(e))t=t[e];else for(let u=0;t&&u<e.length;u++)t=t[e[u]];return t}function st(t,e,u,n,r){if(t=t[r],n===u.length-1)e[r]=t;else if(t)if(t.constructor===Array)for(e=e[r]=Array(t.length),r=0;r<t.length;r++)st(t,e,u,n,r);else e=e[r]||(e[r]=p()),r=u[++n],st(t,e,u,n,r)}function lt(t,e,u,n,r,i,s,l){if(t=t[s])if(n===e.length-1){if(t.constructor===Array){if(u[n]){for(e=0;e<t.length;e++)r.add(i,t[e],!0,!0);return}t=t.join(" ")}r.add(i,t,l,!0)}else if(t.constructor===Array)for(s=0;s<t.length;s++)lt(t,e,u,n,r,i,s,l);else s=e[++n],lt(t,e,u,n,r,i,s,l)}B=G.prototype;B.add=function(t,e,u){if(H(t)&&(e=t,t=it(e,this.key)),e&&(t||t===0)){if(!u&&this.register[t])return this.update(t,e);for(let n=0,r,i;n<this.h.length;n++)i=this.h[n],r=this.K[n],w(r)&&(r=[r]),lt(e,r,this.A,0,this.index[i],t,r[0],u);if(this.I){let n=it(e,this.I),r=p();w(n)&&(n=[n]);for(let i=0,s,l;i<n.length;i++)if(s=n[i],!r[s]&&(r[s]=1,l=this.l[s]||(this.l[s]=[]),!u||!l.includes(t))&&(l[l.length]=t,this.m)){let o=this.register[t]||(this.register[t]=[]);o[o.length]=l}}if(this.store&&(!u||!this.store[t])){let n;if(this.C){n=p();for(let r=0,i;r<this.C.length;r++)i=this.C[r],w(i)?n[i]=e[i]:st(e,n,i,0,i[0])}this.store[t]=n||e}}return this};B.append=function(t,e){return this.add(t,e,!0)};B.update=function(t,e){return this.remove(t).add(t,e)};B.remove=function(t){if(H(t)&&(t=it(t,this.key)),this.register[t]){for(var e=0;e<this.h.length&&(this.index[this.h[e]].remove(t,!this.o),!this.m);e++);if(this.I&&!this.m)for(let u in this.l){e=this.l[u];let n=e.indexOf(t);n!==-1&&(1<e.length?e.splice(n,1):delete this.l[u])}this.store&&delete this.store[t],delete this.register[t]}return this};B.search=function(t,e,u,n){u||(!e&&H(t)?(u=t,t=""):H(e)&&(u=e,e=0));let r=[],i=[],s,l,o,D,h,c,f=0;if(u)if(u.constructor===Array)o=u,u=null;else{if(t=u.query||t,o=(s=u.pluck)||u.index||u.field,D=u.tag,l=this.store&&u.enrich,h=u.bool==="and",e=u.limit||e||100,c=u.offset||0,D&&(w(D)&&(D=[D]),!t)){for(let F=0,g;F<D.length;F++)(g=le.call(this,D[F],e,c,l))&&(r[r.length]=g,f++);return f?r:[]}w(o)&&(o=[o])}o||(o=this.h),h=h&&(1<o.length||D&&1<D.length);let a=!n&&(this.o||this.async)&&[];for(let F=0,g,A,k;F<o.length;F++){let v;if(A=o[F],w(A)||(v=A,A=v.field,t=v.query||t,e=v.limit||e,l=v.enrich||l),a)a[F]=this.index[A].searchAsync(t,e,v||u);else{if(n?g=n[F]:g=this.index[A].search(t,e,v||u),k=g&&g.length,D&&k){let x=[],R=0;h&&(x[0]=[g]);for(let _=0,Z,N;_<D.length;_++)Z=D[_],(k=(N=this.l[Z])&&N.length)&&(R++,x[x.length]=h?[N]:N);R&&(g=h?wt(x,e||100,c||0):ne(g,x),k=g.length)}if(k)i[f]=A,r[f++]=g;else if(h)return[]}}if(a){let F=this;return new Promise(function(g){Promise.all(a).then(function(A){g(F.search(t,e,u,A))})})}if(!f)return[];if(s&&(!l||!this.store))return r[0];for(let F=0,g;F<i.length;F++){if(g=r[F],g.length&&l&&(g=kt.call(this,g)),s)return g;r[F]={field:i[F],result:g}}return r};function le(t,e,u,n){let r=this.l[t],i=r&&r.length-u;if(i&&0<i)return(i>e||u)&&(r=r.slice(u,u+e)),n&&(r=kt.call(this,r)),{tag:t,result:r}}function kt(t){let e=Array(t.length);for(let u=0,n;u<t.length;u++)n=t[u],e[u]={id:n,doc:this.store[n]};return e}B.contain=function(t){return!!this.register[t]};B.get=function(t){return this.store[t]};B.set=function(t,e){return this.store[t]=e,this};B.searchCache=vt;B.export=function(t,e,u,n,r,i){let s;if(typeof i>"u"&&(s=new Promise(l=>{i=l})),r||(r=0),n||(n=0),n<this.h.length){let l=this.h[n],o=this.index[l];e=this,setTimeout(function(){o.export(t,e,r?l:"",n,r++,i)||(n++,r=1,e.export(t,e,l,n,r,i))})}else{let l,o;switch(r){case 1:l="tag",o=this.l,u=null;break;case 2:l="store",o=this.store,u=null;break;default:i();return}Lt(t,this,u,l,n,r,o,i)}return s};B.import=function(t,e){if(e)switch(w(e)&&(e=JSON.parse(e)),t){case"tag":this.l=e;break;case"reg":this.m=!1,this.register=e;for(let n=0,r;n<this.h.length;n++)r=this.index[this.h[n]],r.register=e,r.m=!1;break;case"store":this.store=e;break;default:t=t.split(".");let u=t[0];t=t[1],u&&t&&this.index[u].import(t,e)}};xt(G.prototype);var oe={encode:Tt,F:!1,G:""},De=[y("[\\xE0\\xE1\\xE2\\xE3\\xE4\\xE5]"),"a",y("[\\xE8\\xE9\\xEA\\xEB]"),"e",y("[\\xEC\\xED\\xEE\\xEF]"),"i",y("[\\xF2\\xF3\\xF4\\xF5\\xF6\\u0151]"),"o",y("[\\xF9\\xFA\\xFB\\xFC\\u0171]"),"u",y("[\\xFD\\u0177\\xFF]"),"y",y("\\xF1"),"n",y("[\\xE7c]"),"k",y("\\xDF"),"s",y(" & ")," and "];function Tt(t){var e=t=""+t;return e.normalize&&(e=e.normalize("NFD").replace(ee,"")),pt.call(this,e.toLowerCase(),!t.normalize&&De)}var ce={encode:Mt,F:!1,G:"strict"},Fe=/[^a-z0-9]+/,At={b:"p",v:"f",w:"f",z:"s",x:"s",\\u00DF:"s",d:"t",n:"m",c:"k",g:"k",j:"k",q:"k",i:"e",y:"e",u:"o"};function Mt(t){t=Tt.call(this,t).join(" ");let e=[];if(t){let u=t.split(Fe),n=u.length;for(let r=0,i,s=0;r<n;r++)if((t=u[r])&&(!this.filter||!this.filter[t])){i=t[0];let l=At[i]||i,o=l;for(let D=1;D<t.length;D++){i=t[D];let h=At[i]||i;h&&h!==o&&(l+=h,o=h)}e[s++]=l}}return e}var he={encode:Rt,F:!1,G:""},fe=[y("ae"),"a",y("oe"),"o",y("sh"),"s",y("th"),"t",y("ph"),"f",y("pf"),"f",y("(?![aeo])h(?![aeo])"),"",y("(?!^[aeo])h(?!^[aeo])"),""];function Rt(t,e){return t&&(t=Mt.call(this,t).join(" "),2<t.length&&(t=tt(t,fe)),e||(1<t.length&&(t=mt(t)),t&&(t=t.split(" ")))),t||[]}var ae={encode:ge,F:!1,G:""},Ee=y("(?!\\\\b)[aeo]");function ge(t){return t&&(t=Rt.call(this,t,!0),1<t.length&&(t=t.replace(Ee,"")),1<t.length&&(t=mt(t)),t&&(t=t.split(" "))),t||[]}U["latin:default"]=ue;U["latin:simple"]=oe;U["latin:balance"]=ce;U["latin:advanced"]=he;U["latin:extra"]=ae;var Ht={Index:P,Document:G,Worker:q,registerCharset:function(t,e){U[t]=e},registerLanguage:function(t,e){yt[t]=e}};function jt(t,e){if(!t)return;function u(r){r.target===this&&(r.preventDefault(),r.stopPropagation(),e())}function n(r){r.key.startsWith("Esc")&&(r.preventDefault(),e())}t?.addEventListener("click",u),window.addCleanup(()=>t?.removeEventListener("click",u)),document.addEventListener("keydown",n),window.addCleanup(()=>document.removeEventListener("keydown",n))}function V(t){for(;t.firstChild;)t.removeChild(t.firstChild)}var Ne=Object.hasOwnProperty;var Pt=Xt(It(),1),Ae=(0,Pt.default)();function pe(t){let e=qt(xe(t,"index"),!0);return e.length===0?"/":e}var Ut=(t,e,u)=>{let n=new URL(t.getAttribute(e),u);t.setAttribute(e,n.pathname+n.hash)};function Nt(t,e){t.querySelectorAll(\'[href=""], [href^="./"], [href^="../"]\').forEach(u=>Ut(u,"href",e)),t.querySelectorAll(\'[src=""], [src^="./"], [src^="../"]\').forEach(u=>Ut(u,"src",e))}function me(t){let e=t.split("/").filter(u=>u!=="").slice(0,-1).map(u=>"..").join("/");return e.length===0&&(e="."),e}function Wt(t,e){return Be(me(t),pe(e))}function Be(...t){if(t.length===0)return"";let e=t.filter(u=>u!==""&&u!=="/").map(u=>qt(u)).join("/");return t[0].startsWith("/")&&(e="/"+e),t[t.length-1].endsWith("/")&&(e=e+"/"),e}function ye(t,e){return t===e||t.endsWith("/"+e)}function xe(t,e){return ye(t,e)&&(t=t.slice(0,-e.length)),t}function qt(t,e){return t.startsWith("/")&&(t=t.substring(1)),!e&&t.endsWith("/")&&(t=t.slice(0,-1)),t}var j="basic",S="",we=t=>t.toLowerCase().split(/([^a-z]|[^\\x00-\\x7F])/),b=new Ht.Document({charset:"latin:extra",encode:we,document:{id:"id",tag:"tags",index:[{field:"title",tokenize:"forward"},{field:"content",tokenize:"forward"},{field:"tags",tokenize:"forward"}]}}),ve=new DOMParser,Dt=new Map,nt=30,rt=8,Le=5,Kt=t=>{let e=t.split(/\\s+/).filter(n=>n.trim()!==""),u=e.length;if(u>1)for(let n=1;n<u;n++)e.push(e.slice(0,n+1).join(" "));return e.sort((n,r)=>r.length-n.length)};function zt(t,e,u){let n=Kt(t),r=e.split(/\\s+/).filter(o=>o!==""),i=0,s=r.length-1;if(u){let o=f=>n.some(a=>f.toLowerCase().startsWith(a.toLowerCase())),D=r.map(o),h=0,c=0;for(let f=0;f<Math.max(r.length-nt,0);f++){let F=D.slice(f,f+nt).reduce((g,A)=>g+(A?1:0),0);F>=h&&(h=F,c=f)}i=Math.max(c-nt,0),s=Math.min(i+2*nt,r.length-1),r=r.slice(i,s)}let l=r.map(o=>{for(let D of n)if(o.toLowerCase().includes(D.toLowerCase())){let h=new RegExp(D.toLowerCase(),"gi");return o.replace(h,\'<span class="highlight">$&</span>\')}return o}).join(" ");return`${i===0?"":"..."}${l}${s===r.length-1?"":"..."}`}function Se(t,e){let u=new DOMParser,n=Kt(t),r=u.parseFromString(e.innerHTML,"text/html"),i=l=>{let o=document.createElement("span");return o.className="highlight",o.textContent=l,o},s=(l,o)=>{if(l.nodeType===Node.TEXT_NODE){let D=l.nodeValue??"",h=new RegExp(o.toLowerCase(),"gi"),c=D.match(h);if(!c||c.length===0)return;let f=document.createElement("span"),a=0;for(let F of c){let g=D.indexOf(F,a);f.appendChild(document.createTextNode(D.slice(a,g))),f.appendChild(i(F)),a=g+F.length}f.appendChild(document.createTextNode(D.slice(a))),l.parentNode?.replaceChild(f,l)}else if(l.nodeType===Node.ELEMENT_NODE){if(l.classList.contains("highlight"))return;Array.from(l.childNodes).forEach(D=>s(D,o))}};for(let l of n)s(r.body,l);return r.body}async function ke(t,e,u){let n=t.querySelector(".search-container");if(!n)return;let r=n.closest(".sidebar"),i=t.querySelector(".search-button");if(!i)return;let s=t.querySelector(".search-bar");if(!s)return;let l=t.querySelector(".search-layout");if(!l)return;let o=Object.keys(u),D=E=>{l.appendChild(E)},h=l.dataset.preview==="true",c,f,a=document.createElement("div");a.className="results-container",D(a),h&&(c=document.createElement("div"),c.className="preview-container",D(c));function F(){n.classList.remove("active"),s.value="",r&&(r.style.zIndex=""),V(a),c&&V(c),l.classList.remove("display-results"),j="basic",i.focus()}function g(E){j=E,r&&(r.style.zIndex="1"),n.classList.add("active"),s.focus()}let A=null;async function k(E){if(E.key==="k"&&(E.ctrlKey||E.metaKey)&&!E.shiftKey){E.preventDefault(),n.classList.contains("active")?F():g("basic");return}else if(E.shiftKey&&(E.ctrlKey||E.metaKey)&&E.key.toLowerCase()==="k"){E.preventDefault(),n.classList.contains("active")?F():g("tags"),s.value="#";return}if(A&&A.classList.remove("focus"),!!n.classList.contains("active")){if(E.key==="Enter")if(a.contains(document.activeElement)){let d=document.activeElement;if(d.classList.contains("no-match"))return;await W(d),d.click()}else{let d=document.getElementsByClassName("result-card")[0];if(!d||d.classList.contains("no-match"))return;await W(d),d.click()}else if(E.key==="ArrowUp"||E.shiftKey&&E.key==="Tab"){if(E.preventDefault(),a.contains(document.activeElement)){let d=A||document.activeElement,C=d?.previousElementSibling;d?.classList.remove("focus"),C?.focus(),C&&(A=C),await W(C)}}else if((E.key==="ArrowDown"||E.key==="Tab")&&(E.preventDefault(),document.activeElement===s||A!==null)){let d=A||document.getElementsByClassName("result-card")[0],C=d?.nextElementSibling;d?.classList.remove("focus"),C?.focus(),C&&(A=C),await W(C)}}}let v=(E,d)=>{let C=o[d];return{id:d,slug:C,title:j==="tags"?u[C].title:zt(E,u[C].title??""),content:zt(E,u[C].content??"",!0),tags:x(E.substring(1),u[C].tags)}};function x(E,d){return!d||j!=="tags"?[]:d.map(C=>C.toLowerCase().includes(E.toLowerCase())?`<li><p class="match-tag">#${C}</p></li>`:`<li><p>#${C}</p></li>`).slice(0,Le)}function R(E){return new URL(Wt(e,E),location.toString())}let _=({slug:E,title:d,content:C,tags:M})=>{let T=M.length>0?`<ul class="tags">${M.join("")}</ul>`:"",m=document.createElement("a");m.classList.add("result-card"),m.id=E,m.href=R(E).toString(),m.innerHTML=`\n      <h3 class="card-title">${d}</h3>\n      ${T}\n      <p class="card-description">${C}</p>\n    `,m.addEventListener("click",L=>{L.altKey||L.ctrlKey||L.metaKey||L.shiftKey||F()});let O=L=>{L.altKey||L.ctrlKey||L.metaKey||L.shiftKey||F()};async function I(L){if(!L.target)return;let $t=L.target;await W($t)}return m.addEventListener("mouseenter",I),window.addCleanup(()=>m.removeEventListener("mouseenter",I)),m.addEventListener("click",O),window.addCleanup(()=>m.removeEventListener("click",O)),m};async function Z(E){if(V(a),E.length===0?a.innerHTML=`<a class="result-card no-match">\n          <h3>No results.</h3>\n          <p>Try another search term?</p>\n      </a>`:a.append(...E.map(_)),E.length===0&&c)V(c);else{let d=a.firstElementChild;d.classList.add("focus"),A=d,await W(d)}}async function N(E){if(Dt.has(E))return Dt.get(E);let d=R(E).toString(),C=await fetch(d).then(M=>M.text()).then(M=>{if(M===void 0)throw new Error(`Could not fetch ${d}`);let T=ve.parseFromString(M??"","text/html");return Nt(T,d),[...T.getElementsByClassName("popover-hint")]});return Dt.set(E,C),C}async function W(E){if(!l||!h||!E||!c)return;let d=E.id,C=await N(d).then(T=>T.flatMap(m=>[...Se(S,m).children]));f=document.createElement("div"),f.classList.add("preview-inner"),f.append(...C),c.replaceChildren(f),[...c.getElementsByClassName("highlight")].sort((T,m)=>m.innerHTML.length-T.innerHTML.length)[0]?.scrollIntoView({block:"start"})}async function ct(E){if(!l||!b)return;S=E.target.value,l.classList.toggle("display-results",S!==""),j=S.startsWith("#")?"tags":"basic";let d;if(j==="tags"){S=S.substring(1).trim();let m=S.indexOf(" ");if(m!=-1){let O=S.substring(0,m),I=S.substring(m+1).trim();d=await b.searchAsync({query:I,limit:Math.max(rt,1e4),index:["title","content"],tag:O});for(let L of d)L.result=L.result.slice(0,rt);j="basic",S=I}else d=await b.searchAsync({query:S,limit:rt,index:["tags"]})}else j==="basic"&&(d=await b.searchAsync({query:S,limit:rt,index:["title","content"]}));let C=m=>{let O=d.filter(I=>I.field===m);return O.length===0?[]:[...O[0].result]},T=[...new Set([...C("title"),...C("content"),...C("tags")])].map(m=>v(S,m));await Z(T)}document.addEventListener("keydown",k),window.addCleanup(()=>document.removeEventListener("keydown",k)),i.addEventListener("click",()=>g("basic")),window.addCleanup(()=>i.removeEventListener("click",()=>g("basic"))),s.addEventListener("input",ct),window.addCleanup(()=>s.removeEventListener("input",ct)),jt(n,F),await Te(u)}var _t=!1;async function Te(t){if(_t)return;let e=0,u=[];for(let[n,r]of Object.entries(t))u.push(b.addAsync(e++,{id:e,slug:n,title:r.title,content:r.content,tags:r.tags}));await Promise.all(u),_t=!0}document.addEventListener("nav",async t=>{let e=t.detail.url,u=await fetchData,n=document.getElementsByClassName("search");for(let r of n)await ke(r,e,u)});\n';import{jsx as jsx28,jsxs as jsxs17}from"preact/jsx-runtime";var defaultOptions12={enablePreview:!0},Search_default=__name(userOpts=>{let Search=__name(({displayClass,cfg})=>{let opts={...defaultOptions12,...userOpts},searchPlaceholder=i18n(cfg.locale).components.search.searchBarPlaceholder;return jsxs17("div",{class:classNames(displayClass,"search"),children:[jsxs17("button",{class:"search-button",children:[jsx28("p",{children:i18n(cfg.locale).components.search.title}),jsxs17("svg",{role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 19.9 19.7",children:[jsx28("title",{children:"Search"}),jsxs17("g",{class:"search-path",fill:"none",children:[jsx28("path",{"stroke-linecap":"square",d:"M18.5 18.3l-5.4-5.4"}),jsx28("circle",{cx:"8",cy:"8",r:"7"})]})]})]}),jsx28("div",{class:"search-container",children:jsxs17("div",{class:"search-space",children:[jsx28("input",{autocomplete:"off",class:"search-bar",name:"search",type:"text","aria-label":searchPlaceholder,placeholder:searchPlaceholder}),jsx28("div",{class:"search-layout","data-preview":opts.enablePreview})]})})]})},"Search");return Search.afterDOMLoaded=search_inline_default,Search.css=search_default,Search},"default");var footer_default=`footer {
  text-align: left;
  margin-bottom: 4rem;
  opacity: 0.7;
}
footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: -1rem;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyJmb290ZXIuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiZm9vdGVyIHtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgbWFyZ2luLWJvdHRvbTogNHJlbTtcbiAgb3BhY2l0eTogMC43O1xuXG4gICYgdWwge1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGdhcDogMXJlbTtcbiAgICBtYXJnaW4tdG9wOiAtMXJlbTtcbiAgfVxufVxuIl19 */`;var version="4.5.0";import{jsx as jsx29,jsxs as jsxs18}from"preact/jsx-runtime";var Footer_default=__name(opts=>{let Footer=__name(({displayClass,cfg})=>{let year=new Date().getFullYear(),links=opts?.links??[];return jsxs18("footer",{class:`${displayClass??""}`,children:[jsxs18("p",{children:[i18n(cfg.locale).components.footer.createdWith," ",jsxs18("a",{href:"https://quartz.jzhao.xyz/",children:["Quartz v",version]})," \xA9 ",year]}),jsx29("ul",{children:Object.entries(links).map(([text,link])=>jsx29("li",{children:jsx29("a",{href:link,children:text})}))})]})},"Footer");return Footer.css=footer_default,Footer},"default");import{jsx as jsx30}from"preact/jsx-runtime";import{jsx as jsx31}from"preact/jsx-runtime";var recentNotes_default=`.recent-notes > h3 {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}
.recent-notes > ul.recent-ul {
  list-style: none;
  margin-top: 1rem;
  padding-left: 0;
}
.recent-notes > ul.recent-ul > li {
  margin: 1rem 0;
}
.recent-notes > ul.recent-ul > li .section > .desc > h3 > a {
  background-color: transparent;
}
.recent-notes > ul.recent-ul > li .section > .meta {
  margin: 0 0 0.5rem 0;
  opacity: 0.6;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyJyZWNlbnROb3Rlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUNBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLnJlY2VudC1ub3RlcyB7XG4gICYgPiBoMyB7XG4gICAgbWFyZ2luOiAwLjVyZW0gMCAwIDA7XG4gICAgZm9udC1zaXplOiAxcmVtO1xuICB9XG5cbiAgJiA+IHVsLnJlY2VudC11bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgIHBhZGRpbmctbGVmdDogMDtcblxuICAgICYgPiBsaSB7XG4gICAgICBtYXJnaW46IDFyZW0gMDtcbiAgICAgIC5zZWN0aW9uID4gLmRlc2MgPiBoMyA+IGEge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIH1cblxuICAgICAgLnNlY3Rpb24gPiAubWV0YSB7XG4gICAgICAgIG1hcmdpbjogMCAwIDAuNXJlbSAwO1xuICAgICAgICBvcGFjaXR5OiAwLjY7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0= */`;import{jsx as jsx32,jsxs as jsxs19}from"preact/jsx-runtime";var defaultOptions13=__name(cfg=>({limit:3,linkToMore:!1,showTags:!0,filter:__name(()=>!0,"filter"),sort:byDateAndAlphabetical(cfg)}),"defaultOptions"),RecentNotes_default=__name(userOpts=>{let RecentNotes=__name(({allFiles,fileData,displayClass,cfg})=>{let opts={...defaultOptions13(cfg),...userOpts},pages=allFiles.filter(opts.filter).sort(opts.sort),remaining=Math.max(0,pages.length-opts.limit);return jsxs19("div",{class:classNames(displayClass,"recent-notes"),children:[jsx32("h3",{children:opts.title??i18n(cfg.locale).components.recentNotes.title}),jsx32("ul",{class:"recent-ul",children:pages.slice(0,opts.limit).map(page=>{let title=page.frontmatter?.title??i18n(cfg.locale).propertyDefaults.title,tags=page.frontmatter?.tags??[];return jsx32("li",{class:"recent-li",children:jsxs19("div",{class:"section",children:[jsx32("div",{class:"desc",children:jsx32("h3",{children:jsx32("a",{href:resolveRelative(fileData.slug,page.slug),class:"internal",children:title})})}),page.dates&&jsx32("p",{class:"meta",children:jsx32(Date2,{date:getDate(cfg,page),locale:cfg.locale})}),opts.showTags&&jsx32("ul",{class:"tags",children:tags.map(tag=>jsx32("li",{children:jsx32("a",{class:"internal tag-link",href:resolveRelative(fileData.slug,`tags/${tag}`),children:tag})}))})]})})})}),opts.linkToMore&&remaining>0&&jsx32("p",{children:jsx32("a",{href:resolveRelative(fileData.slug,opts.linkToMore),children:i18n(cfg.locale).components.recentNotes.seeRemainingMore({remaining})})})]})},"RecentNotes");return RecentNotes.css=recentNotes_default,RecentNotes},"default");import{jsx as jsx33,jsxs as jsxs20}from"preact/jsx-runtime";import{Fragment as Fragment5,jsx as jsx34}from"preact/jsx-runtime";import{jsx as jsx35}from"preact/jsx-runtime";import{jsx as jsx36}from"preact/jsx-runtime";var sharedPageComponents={head:Head_default(),header:[PageTitle_default(),Spacer_default(),Search_default(),Darkmode_default()],afterBody:[],footer:Footer_default({links:{GitHub:"https://github.com/sirbor",LinkedIn:"https://linkedin.com/in/dominicbor",Twitter:"https://x.com/dominicbor",Email:"mailto:hello@dominicbor.me"}})},defaultContentPageLayout={beforeBody:[ArticleTitle_default(),ContentMeta_default(),TagList_default()],left:[],right:[]},defaultListPageLayout={beforeBody:[ArticleTitle_default(),RecentNotes_default({title:"Latest Posts",limit:8,showTags:!0,linkToMore:!1})],left:[],right:[]};import chalk7 from"chalk";async function processContent(ctx,tree,fileData,allFiles,opts,resources){let slug=fileData.slug,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),content=renderPage(cfg,slug,{ctx,fileData,externalResources,cfg,children:[],tree,allFiles},opts,externalResources);return write({ctx,content,slug,ext:".html"})}__name(processContent,"processContent");var ContentPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultContentPageLayout,pageBody:Content_default(),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"ContentPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),containsIndex=!1;for(let[tree,file]of content){let slug=file.data.slug;slug==="index"&&(containsIndex=!0),!(slug.endsWith("/index")||slug.startsWith("tags/"))&&(yield processContent(ctx,tree,file.data,allFiles,opts,resources))}containsIndex||console.log(chalk7.yellow(`
Warning: you seem to be missing an \`index.md\` home page file at the root of your \`${ctx.argv.directory}\` folder (\`${path6.join(ctx.argv.directory,"index.md")} does not exist\`). This may cause errors when deploying.`))},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),changedSlugs=new Set;for(let changeEvent of changeEvents)changeEvent.file&&(changeEvent.type==="add"||changeEvent.type==="change")&&changedSlugs.add(changeEvent.file.data.slug);for(let[tree,file]of content){let slug=file.data.slug;changedSlugs.has(slug)&&(slug.endsWith("/index")||slug.startsWith("tags/")||(yield processContent(ctx,tree,file.data,allFiles,opts,resources)))}}}},"ContentPage");import{VFile}from"vfile";function defaultProcessedContent(vfileData){let root={type:"root",children:[]},vfile=new VFile("");return vfile.data=vfileData,[root,vfile]}__name(defaultProcessedContent,"defaultProcessedContent");function computeTagInfo(allFiles,content,locale){let tags=new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes));tags.add("index");let tagDescriptions=Object.fromEntries([...tags].map(tag=>{let title=tag==="index"?i18n(locale).pages.tagContent.tagIndex:`${i18n(locale).pages.tagContent.tag}: ${tag}`;return[tag,defaultProcessedContent({slug:joinSegments("tags",tag),frontmatter:{title,tags:[]}})]}));for(let[tree,file]of content){let slug=file.data.slug;if(slug.startsWith("tags/")){let tag=slug.slice(5);tags.has(tag)&&(tagDescriptions[tag]=[tree,file],file.data.frontmatter?.title===tag&&(file.data.frontmatter.title=`${i18n(locale).pages.tagContent.tag}: ${tag}`))}}return[tags,tagDescriptions]}__name(computeTagInfo,"computeTagInfo");async function processTagPage(ctx,tag,tagContent,allFiles,opts,resources){let slug=joinSegments("tags",tag),[tree,file]=tagContent,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),componentData={ctx,fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content=renderPage(cfg,slug,componentData,opts,externalResources);return write({ctx,content,slug:file.data.slug,ext:".html"})}__name(processTagPage,"processTagPage");var TagPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:TagContent_default({sort:userOpts?.sort}),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"TagPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,[tags,tagDescriptions]=computeTagInfo(allFiles,content,cfg.locale);for(let tag of tags)yield processTagPage(ctx,tag,tagDescriptions[tag],allFiles,opts,resources)},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,affectedTags=new Set;for(let changeEvent of changeEvents){if(!changeEvent.file)continue;let slug=changeEvent.file.data.slug;if(slug.startsWith("tags/")){let tag=slug.slice(5);affectedTags.add(tag)}(changeEvent.file.data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes).forEach(tag=>affectedTags.add(tag)),affectedTags.add("index")}if(affectedTags.size>0){let[_tags,tagDescriptions]=computeTagInfo(allFiles,content,cfg.locale);for(let tag of affectedTags)tagDescriptions[tag]&&(yield processTagPage(ctx,tag,tagDescriptions[tag],allFiles,opts,resources))}}}},"TagPage");import path7 from"path";async function*processFolderInfo(ctx,folderInfo,allFiles,opts,resources){for(let[folder,folderContent]of Object.entries(folderInfo)){let slug=joinSegments(folder,"index"),[tree,file]=folderContent,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),componentData={ctx,fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content=renderPage(cfg,slug,componentData,opts,externalResources);yield write({ctx,content,slug,ext:".html"})}}__name(processFolderInfo,"processFolderInfo");function computeFolderInfo(folders,content,locale){let folderInfo=Object.fromEntries([...folders].map(folder=>[folder,defaultProcessedContent({slug:joinSegments(folder,"index"),frontmatter:{title:`${i18n(locale).pages.folderContent.folder}: ${folder}`,tags:[]}})]));for(let[tree,file]of content){let slug=stripSlashes(simplifySlug(file.data.slug));folders.has(slug)&&(folderInfo[slug]=[tree,file])}return folderInfo}__name(computeFolderInfo,"computeFolderInfo");function _getFolders(slug){var folderName=path7.dirname(slug??"");let parentFolderNames=[folderName];for(;folderName!==".";)folderName=path7.dirname(folderName??""),parentFolderNames.push(folderName);return parentFolderNames}__name(_getFolders,"_getFolders");var FolderPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:FolderContent_default({sort:userOpts?.sort}),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"FolderPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,folders=new Set(allFiles.flatMap(data=>data.slug?_getFolders(data.slug).filter(folderName=>folderName!=="."&&folderName!=="tags"):[])),folderInfo=computeFolderInfo(folders,content,cfg.locale);yield*processFolderInfo(ctx,folderInfo,allFiles,opts,resources)},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,affectedFolders=new Set;for(let changeEvent of changeEvents){if(!changeEvent.file)continue;let slug=changeEvent.file.data.slug;_getFolders(slug).filter(folderName=>folderName!=="."&&folderName!=="tags").forEach(folder=>affectedFolders.add(folder))}if(affectedFolders.size>0){let folderInfo=computeFolderInfo(affectedFolders,content,cfg.locale);yield*processFolderInfo(ctx,folderInfo,allFiles,opts,resources)}}}},"FolderPage");import{toHtml as toHtml2}from"hast-util-to-html";import{jsx as jsx37}from"preact/jsx-runtime";var defaultOptions14={enableSiteMap:!0,enableRSS:!0,rssLimit:10,rssFullHtml:!1,rssSlug:"index",includeEmptyFiles:!0};function generateSiteMap(cfg,idx){let base=cfg.baseUrl??"",createURLEntry=__name((slug,content)=>`<url>
    <loc>https://${joinSegments(base,encodeURI(slug))}</loc>
    ${content.date&&`<lastmod>${content.date.toISOString()}</lastmod>`}
  </url>`,"createURLEntry");return`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Array.from(idx).map(([slug,content])=>createURLEntry(simplifySlug(slug),content)).join("")}</urlset>`}__name(generateSiteMap,"generateSiteMap");function generateRSSFeed(cfg,idx,limit){let base=cfg.baseUrl??"",createURLEntry=__name((slug,content)=>`<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base,encodeURI(slug))}</link>
    <guid>https://${joinSegments(base,encodeURI(slug))}</guid>
    <description>${content.richContent??content.description}</description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`,"createURLEntry"),items=Array.from(idx).sort(([_,f1],[__,f2])=>f1.date&&f2.date?f2.date.getTime()-f1.date.getTime():f1.date&&!f2.date?-1:!f1.date&&f2.date?1:f1.title.localeCompare(f2.title)).map(([slug,content])=>createURLEntry(simplifySlug(slug),content)).slice(0,limit??idx.size).join("");return`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${base}</link>
      <description>${limit?i18n(cfg.locale).pages.rss.lastFewNotes({count:limit}):i18n(cfg.locale).pages.rss.recentNotes} on ${escapeHTML(cfg.pageTitle)}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      ${items}
    </channel>
  </rss>`}__name(generateRSSFeed,"generateRSSFeed");var ContentIndex=__name(opts=>(opts={...defaultOptions14,...opts},{name:"ContentIndex",async*emit(ctx,content){let cfg=ctx.cfg.configuration,linkIndex=new Map;for(let[tree,file]of content){let slug=file.data.slug,date=getDate(ctx.cfg.configuration,file.data)??new Date;(opts?.includeEmptyFiles||file.data.text&&file.data.text!=="")&&linkIndex.set(slug,{slug,filePath:file.data.relativePath,title:file.data.frontmatter?.title,links:file.data.links??[],tags:file.data.frontmatter?.tags??[],content:file.data.text??"",richContent:opts?.rssFullHtml?escapeHTML(toHtml2(tree,{allowDangerousHtml:!0})):void 0,date,description:file.data.description??""})}opts?.enableSiteMap&&(yield write({ctx,content:generateSiteMap(cfg,linkIndex),slug:"sitemap",ext:".xml"})),opts?.enableRSS&&(yield write({ctx,content:generateRSSFeed(cfg,linkIndex,opts.rssLimit),slug:opts?.rssSlug??"index",ext:".xml"}));let fp=joinSegments("static","contentIndex"),simplifiedIndex=Object.fromEntries(Array.from(linkIndex).map(([slug,content2])=>(delete content2.description,delete content2.date,[slug,content2])));yield write({ctx,content:JSON.stringify(simplifiedIndex),slug:fp,ext:".json"})},externalResources:__name(ctx=>{if(opts?.enableRSS)return{additionalHead:[jsx37("link",{rel:"alternate",type:"application/rss+xml",title:"RSS Feed",href:`https://${ctx.cfg.configuration.baseUrl}/index.xml`})]}},"externalResources")}),"ContentIndex");import path8 from"path";async function*processFile(ctx,file){let ogSlug=simplifySlug(file.data.slug);for(let aliasTarget of file.data.aliases??[]){let aliasTargetSlug=isRelativeURL(aliasTarget)?path8.normalize(path8.join(ogSlug,"..",aliasTarget)):aliasTarget,redirUrl=resolveRelative(aliasTargetSlug,ogSlug);yield write({ctx,content:`
        <!DOCTYPE html>
        <html lang="en-us">
        <head>
        <title>${ogSlug}</title>
        <link rel="canonical" href="${redirUrl}">
        <meta name="robots" content="noindex">
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0; url=${redirUrl}">
        </head>
        </html>
        `,slug:aliasTargetSlug,ext:".html"})}}__name(processFile,"processFile");var AliasRedirects=__name(()=>({name:"AliasRedirects",async*emit(ctx,content){for(let[_tree,file]of content)yield*processFile(ctx,file)},async*partialEmit(ctx,_content,_resources,changeEvents){for(let changeEvent of changeEvents)changeEvent.file&&(changeEvent.type==="add"||changeEvent.type==="change")&&(yield*processFile(ctx,changeEvent.file))}}),"AliasRedirects");import path10 from"path";import fs3 from"fs";import path9 from"path";import{globby}from"globby";function toPosixPath(fp){return fp.split(path9.sep).join("/")}__name(toPosixPath,"toPosixPath");async function glob(pattern,cwd,ignorePatterns){return(await globby(pattern,{cwd,ignore:ignorePatterns,gitignore:!0})).map(toPosixPath)}__name(glob,"glob");var filesToCopy=__name(async(argv,cfg)=>await glob("**",argv.directory,["**/*.md",...cfg.configuration.ignorePatterns]),"filesToCopy"),copyFile=__name(async(argv,fp)=>{let src=joinSegments(argv.directory,fp),name=slugifyFilePath(fp),dest=joinSegments(argv.output,name),dir=path10.dirname(dest);return await fs3.promises.mkdir(dir,{recursive:!0}),await fs3.promises.copyFile(src,dest),dest},"copyFile"),Assets=__name(()=>({name:"Assets",async*emit({argv,cfg}){let fps=await filesToCopy(argv,cfg);for(let fp of fps)yield copyFile(argv,fp)},async*partialEmit(ctx,_content,_resources,changeEvents){for(let changeEvent of changeEvents)if(path10.extname(changeEvent.path)!==".md"){if(changeEvent.type==="add"||changeEvent.type==="change")yield copyFile(ctx.argv,changeEvent.path);else if(changeEvent.type==="delete"){let name=slugifyFilePath(changeEvent.path),dest=joinSegments(ctx.argv.output,name);await fs3.promises.unlink(dest)}}}}),"Assets");import fs4 from"fs";import{dirname}from"path";var Static=__name(()=>({name:"Static",async*emit({argv,cfg}){let staticPath=joinSegments(QUARTZ,"static"),fps=await glob("**",staticPath,cfg.configuration.ignorePatterns),outputStaticPath=joinSegments(argv.output,"static");await fs4.promises.mkdir(outputStaticPath,{recursive:!0});for(let fp of fps){let src=joinSegments(staticPath,fp),dest=joinSegments(outputStaticPath,fp);await fs4.promises.mkdir(dirname(dest),{recursive:!0}),await fs4.promises.copyFile(src,dest),yield dest}},async*partialEmit(){}}),"Static");import sharp2 from"sharp";var Favicon=__name(()=>({name:"Favicon",async*emit({argv}){let iconPath=joinSegments(QUARTZ,"static","icon.png"),faviconContent=sharp2(iconPath).resize(48,48).toFormat("png");yield write({ctx:{argv},slug:"favicon",ext:".ico",content:faviconContent})},async*partialEmit(){}}),"Favicon");var spa_inline_default='var W=Object.create;var L=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var V=Object.getPrototypeOf,q=Object.prototype.hasOwnProperty;var z=(u,e)=>()=>(e||u((e={exports:{}}).exports,e),e.exports);var K=(u,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let F of I(e))!q.call(u,F)&&F!==t&&L(u,F,{get:()=>e[F],enumerable:!(r=_(e,F))||r.enumerable});return u};var Z=(u,e,t)=>(t=u!=null?W(V(u)):{},K(e||!u||!u.__esModule?L(t,"default",{value:u,enumerable:!0}):t,u));var k=z((gu,U)=>{"use strict";U.exports=eu;function f(u){return u instanceof Buffer?Buffer.from(u):new u.constructor(u.buffer.slice(),u.byteOffset,u.length)}function eu(u){if(u=u||{},u.circles)return tu(u);let e=new Map;if(e.set(Date,n=>new Date(n)),e.set(Map,(n,l)=>new Map(r(Array.from(n),l))),e.set(Set,(n,l)=>new Set(r(Array.from(n),l))),u.constructorHandlers)for(let n of u.constructorHandlers)e.set(n[0],n[1]);let t=null;return u.proto?o:F;function r(n,l){let D=Object.keys(n),i=new Array(D.length);for(let a=0;a<D.length;a++){let s=D[a],c=n[s];typeof c!="object"||c===null?i[s]=c:c.constructor!==Object&&(t=e.get(c.constructor))?i[s]=t(c,l):ArrayBuffer.isView(c)?i[s]=f(c):i[s]=l(c)}return i}function F(n){if(typeof n!="object"||n===null)return n;if(Array.isArray(n))return r(n,F);if(n.constructor!==Object&&(t=e.get(n.constructor)))return t(n,F);let l={};for(let D in n){if(Object.hasOwnProperty.call(n,D)===!1)continue;let i=n[D];typeof i!="object"||i===null?l[D]=i:i.constructor!==Object&&(t=e.get(i.constructor))?l[D]=t(i,F):ArrayBuffer.isView(i)?l[D]=f(i):l[D]=F(i)}return l}function o(n){if(typeof n!="object"||n===null)return n;if(Array.isArray(n))return r(n,o);if(n.constructor!==Object&&(t=e.get(n.constructor)))return t(n,o);let l={};for(let D in n){let i=n[D];typeof i!="object"||i===null?l[D]=i:i.constructor!==Object&&(t=e.get(i.constructor))?l[D]=t(i,o):ArrayBuffer.isView(i)?l[D]=f(i):l[D]=o(i)}return l}}function tu(u){let e=[],t=[],r=new Map;if(r.set(Date,D=>new Date(D)),r.set(Map,(D,i)=>new Map(o(Array.from(D),i))),r.set(Set,(D,i)=>new Set(o(Array.from(D),i))),u.constructorHandlers)for(let D of u.constructorHandlers)r.set(D[0],D[1]);let F=null;return u.proto?l:n;function o(D,i){let a=Object.keys(D),s=new Array(a.length);for(let c=0;c<a.length;c++){let A=a[c],E=D[A];if(typeof E!="object"||E===null)s[A]=E;else if(E.constructor!==Object&&(F=r.get(E.constructor)))s[A]=F(E,i);else if(ArrayBuffer.isView(E))s[A]=f(E);else{let R=e.indexOf(E);R!==-1?s[A]=t[R]:s[A]=i(E)}}return s}function n(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return o(D,n);if(D.constructor!==Object&&(F=r.get(D.constructor)))return F(D,n);let i={};e.push(D),t.push(i);for(let a in D){if(Object.hasOwnProperty.call(D,a)===!1)continue;let s=D[a];if(typeof s!="object"||s===null)i[a]=s;else if(s.constructor!==Object&&(F=r.get(s.constructor)))i[a]=F(s,n);else if(ArrayBuffer.isView(s))i[a]=f(s);else{let c=e.indexOf(s);c!==-1?i[a]=t[c]:i[a]=n(s)}}return e.pop(),t.pop(),i}function l(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return o(D,l);if(D.constructor!==Object&&(F=r.get(D.constructor)))return F(D,l);let i={};e.push(D),t.push(i);for(let a in D){let s=D[a];if(typeof s!="object"||s===null)i[a]=s;else if(s.constructor!==Object&&(F=r.get(s.constructor)))i[a]=F(s,l);else if(ArrayBuffer.isView(s))i[a]=f(s);else{let c=e.indexOf(s);c!==-1?i[a]=t[c]:i[a]=l(s)}}return e.pop(),t.pop(),i}}});var y=u=>(e,t)=>e[`node${u}`]===t[`node${u}`],Q=y("Name"),Y=y("Type"),G=y("Value");function T(u,e){if(u.attributes.length===0&&e.attributes.length===0)return[];let t=[],r=new Map,F=new Map;for(let o of u.attributes)r.set(o.name,o.value);for(let o of e.attributes){let n=r.get(o.name);o.value===n?r.delete(o.name):(typeof n<"u"&&r.delete(o.name),F.set(o.name,o.value))}for(let o of r.keys())t.push({type:5,name:o});for(let[o,n]of F.entries())t.push({type:4,name:o,value:n});return t}function m(u,e=!0){let t=`${u.localName}`;for(let{name:r,value:F}of u.attributes)e&&r.startsWith("data-")||(t+=`[${r}=${F}]`);return t+=u.innerHTML,t}function g(u){switch(u.tagName){case"BASE":case"TITLE":return u.localName;case"META":{if(u.hasAttribute("name"))return`meta[name="${u.getAttribute("name")}"]`;if(u.hasAttribute("property"))return`meta[name="${u.getAttribute("property")}"]`;break}case"LINK":{if(u.hasAttribute("rel")&&u.hasAttribute("href"))return`link[rel="${u.getAttribute("rel")}"][href="${u.getAttribute("href")}"]`;if(u.hasAttribute("href"))return`link[href="${u.getAttribute("href")}"]`;break}}return m(u)}function J(u){let[e,t=""]=u.split("?");return`${e}?t=${Date.now()}&${t.replace(/t=\\d+/g,"")}`}function C(u){if(u.nodeType===1&&u.hasAttribute("data-persist"))return u;if(u.nodeType===1&&u.localName==="script"){let e=document.createElement("script");for(let{name:t,value:r}of u.attributes)t==="src"&&(r=J(r)),e.setAttribute(t,r);return e.innerHTML=u.innerHTML,e}return u.cloneNode(!0)}function X(u,e){if(u.children.length===0&&e.children.length===0)return[];let t=[],r=new Map,F=new Map,o=new Map;for(let n of u.children)r.set(g(n),n);for(let n of e.children){let l=g(n),D=r.get(l);D?m(n,!1)!==m(D,!1)&&F.set(l,C(n)):o.set(l,C(n)),r.delete(l)}for(let n of u.childNodes){if(n.nodeType===1){let l=g(n);if(r.has(l)){t.push({type:1});continue}else if(F.has(l)){let D=F.get(l);t.push({type:3,attributes:T(n,D),children:j(n,D)});continue}}t.push(void 0)}for(let n of o.values())t.push({type:0,node:C(n)});return t}function j(u,e){let t=[],r=Math.max(u.childNodes.length,e.childNodes.length);for(let F=0;F<r;F++){let o=u.childNodes.item(F),n=e.childNodes.item(F);t[F]=p(o,n)}return t}function p(u,e){if(!u)return{type:0,node:C(e)};if(!e)return{type:1};if(Y(u,e)){if(u.nodeType===3){let t=u.nodeValue,r=e.nodeValue;if(t.trim().length===0&&r.trim().length===0)return}if(u.nodeType===1){if(Q(u,e)){let t=u.tagName==="HEAD"?X:j;return{type:3,attributes:T(u,e),children:t(u,e)}}return{type:2,node:C(e)}}else return u.nodeType===9?p(u.documentElement,e.documentElement):G(u,e)?void 0:{type:2,value:e.nodeValue}}return{type:2,node:C(e)}}function uu(u,e){if(e.length!==0)for(let{type:t,name:r,value:F}of e)t===5?u.removeAttribute(r):t===4&&u.setAttribute(r,F)}async function w(u,e,t){if(!e)return;let r;switch(u.nodeType===9?(u=u.documentElement,r=u):t?r=t:r=u,e.type){case 0:{let{node:F}=e;u.appendChild(F);return}case 1:{if(!r)return;u.removeChild(r);return}case 2:{if(!r)return;let{node:F,value:o}=e;if(typeof o=="string"){r.nodeValue=o;return}r.replaceWith(F);return}case 3:{if(!r)return;let{attributes:F,children:o}=e;uu(r,F);let n=Array.from(r.childNodes);await Promise.all(o.map((l,D)=>w(r,l,n[D])));return}}}function b(u,e){let t=p(u,e);return w(u,t)}var Bu=Object.hasOwnProperty;var O=Z(k(),1),Du=(0,O.default)();function v(u){return u.document.body.dataset.slug}var M=(u,e,t)=>{let r=new URL(u.getAttribute(e),t);u.setAttribute(e,r.pathname+r.hash)};function N(u,e){u.querySelectorAll(\'[href=""], [href^="./"], [href^="../"]\').forEach(t=>M(t,"href",e)),u.querySelectorAll(\'[src=""], [src^="./"], [src^="../"]\').forEach(t=>M(t,"src",e))}var nu=/<link rel="canonical" href="([^"]*)">/;async function P(u){let e=await fetch(`${u}`);if(!e.headers.get("content-type")?.startsWith("text/html"))return e;let t=await e.clone().text(),[r,F]=t.match(nu)??[];return F?fetch(`${new URL(F,u)}`):e}var ru=1,d=document.createElement("route-announcer"),Fu=u=>u?.nodeType===ru,iu=u=>{try{let e=new URL(u);if(window.location.origin===e.origin)return!0}catch{}return!1},ou=u=>{let e=u.origin===window.location.origin,t=u.pathname===window.location.pathname;return e&&t},H=({target:u})=>{if(!Fu(u)||u.attributes.getNamedItem("target")?.value==="_blank")return;let e=u.closest("a");if(!e||"routerIgnore"in e.dataset)return;let{href:t}=e;if(iu(t))return{url:new URL(t),scroll:"routerNoscroll"in e.dataset?!1:void 0}};function $(u){let e=new CustomEvent("nav",{detail:{url:u}});document.dispatchEvent(e)}var S=new Set;window.addCleanup=u=>S.add(u);function lu(){let u=document.createElement("div");u.className="navigation-progress",u.style.width="0",document.body.contains(u)||document.body.appendChild(u),setTimeout(()=>{u.style.width="80%"},100)}var B=!1,x;async function su(u,e=!1){B=!0,lu(),x=x||new DOMParser;let t=await P(u).then(D=>{if(D.headers.get("content-type")?.startsWith("text/html"))return D.text();window.location.assign(u)}).catch(()=>{window.location.assign(u)});if(!t)return;let r=new CustomEvent("prenav",{detail:{}});document.dispatchEvent(r),S.forEach(D=>D()),S.clear();let F=x.parseFromString(t,"text/html");N(F,u);let o=F.querySelector("title")?.textContent;if(o)document.title=o;else{let D=document.querySelector("h1");o=D?.innerText??D?.textContent??u.pathname}d.textContent!==o&&(d.textContent=o),d.dataset.persist="",F.body.appendChild(d),b(document.body,F.body),e||(u.hash?document.getElementById(decodeURIComponent(u.hash.substring(1)))?.scrollIntoView():window.scrollTo({top:0})),document.head.querySelectorAll(":not([spa-preserve])").forEach(D=>D.remove()),F.head.querySelectorAll(":not([spa-preserve])").forEach(D=>document.head.appendChild(D)),e||history.pushState({},"",u),$(v(window)),delete d.dataset.persist}async function h(u,e=!1){if(!B){B=!0;try{await su(u,e)}catch(t){console.error(t),window.location.assign(u)}finally{B=!1}}}window.spaNavigate=h;function au(){return typeof window<"u"&&(window.addEventListener("click",async u=>{let{url:e}=H(u)??{};if(!(!e||u.ctrlKey||u.metaKey)){if(u.preventDefault(),ou(e)&&e.hash){document.getElementById(decodeURIComponent(e.hash.substring(1)))?.scrollIntoView(),history.pushState({},"",e);return}h(e,!1)}}),window.addEventListener("popstate",u=>{let{url:e}=H(u)??{};window.location.hash&&window.location.pathname===e?.pathname||h(new URL(window.location.toString()),!0)})),new class{go(e){let t=new URL(e,window.location.toString());return h(t,!1)}back(){return window.history.back()}forward(){return window.history.forward()}}}au();$(v(window));if(!customElements.get("route-announcer")){let u={"aria-live":"assertive","aria-atomic":"true",style:"position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"};customElements.define("route-announcer",class extends HTMLElement{constructor(){super()}connectedCallback(){for(let[t,r]of Object.entries(u))this.setAttribute(t,r)}})}\n';var popover_inline_default='var oe=Object.create;var Bt=Object.defineProperty;var ie=Object.getOwnPropertyDescriptor;var re=Object.getOwnPropertyNames;var se=Object.getPrototypeOf,ce=Object.prototype.hasOwnProperty;var le=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var De=(t,e,n,u)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of re(e))!ce.call(t,o)&&o!==n&&Bt(t,o,{get:()=>e[o],enumerable:!(u=ie(e,o))||u.enumerable});return t};var ae=(t,e,n)=>(n=t!=null?oe(se(t)):{},De(e||!t||!t.__esModule?Bt(n,"default",{value:t,enumerable:!0}):n,t));var Qt=le((sn,Zt)=>{"use strict";Zt.exports=Le;function K(t){return t instanceof Buffer?Buffer.from(t):new t.constructor(t.buffer.slice(),t.byteOffset,t.length)}function Le(t){if(t=t||{},t.circles)return Te(t);let e=new Map;if(e.set(Date,i=>new Date(i)),e.set(Map,(i,l)=>new Map(u(Array.from(i),l))),e.set(Set,(i,l)=>new Set(u(Array.from(i),l))),t.constructorHandlers)for(let i of t.constructorHandlers)e.set(i[0],i[1]);let n=null;return t.proto?r:o;function u(i,l){let s=Object.keys(i),c=new Array(s.length);for(let a=0;a<s.length;a++){let D=s[a],f=i[D];typeof f!="object"||f===null?c[D]=f:f.constructor!==Object&&(n=e.get(f.constructor))?c[D]=n(f,l):ArrayBuffer.isView(f)?c[D]=K(f):c[D]=l(f)}return c}function o(i){if(typeof i!="object"||i===null)return i;if(Array.isArray(i))return u(i,o);if(i.constructor!==Object&&(n=e.get(i.constructor)))return n(i,o);let l={};for(let s in i){if(Object.hasOwnProperty.call(i,s)===!1)continue;let c=i[s];typeof c!="object"||c===null?l[s]=c:c.constructor!==Object&&(n=e.get(c.constructor))?l[s]=n(c,o):ArrayBuffer.isView(c)?l[s]=K(c):l[s]=o(c)}return l}function r(i){if(typeof i!="object"||i===null)return i;if(Array.isArray(i))return u(i,r);if(i.constructor!==Object&&(n=e.get(i.constructor)))return n(i,r);let l={};for(let s in i){let c=i[s];typeof c!="object"||c===null?l[s]=c:c.constructor!==Object&&(n=e.get(c.constructor))?l[s]=n(c,r):ArrayBuffer.isView(c)?l[s]=K(c):l[s]=r(c)}return l}}function Te(t){let e=[],n=[],u=new Map;if(u.set(Date,s=>new Date(s)),u.set(Map,(s,c)=>new Map(r(Array.from(s),c))),u.set(Set,(s,c)=>new Set(r(Array.from(s),c))),t.constructorHandlers)for(let s of t.constructorHandlers)u.set(s[0],s[1]);let o=null;return t.proto?l:i;function r(s,c){let a=Object.keys(s),D=new Array(a.length);for(let f=0;f<a.length;f++){let F=a[f],d=s[F];if(typeof d!="object"||d===null)D[F]=d;else if(d.constructor!==Object&&(o=u.get(d.constructor)))D[F]=o(d,c);else if(ArrayBuffer.isView(d))D[F]=K(d);else{let m=e.indexOf(d);m!==-1?D[F]=n[m]:D[F]=c(d)}}return D}function i(s){if(typeof s!="object"||s===null)return s;if(Array.isArray(s))return r(s,i);if(s.constructor!==Object&&(o=u.get(s.constructor)))return o(s,i);let c={};e.push(s),n.push(c);for(let a in s){if(Object.hasOwnProperty.call(s,a)===!1)continue;let D=s[a];if(typeof D!="object"||D===null)c[a]=D;else if(D.constructor!==Object&&(o=u.get(D.constructor)))c[a]=o(D,i);else if(ArrayBuffer.isView(D))c[a]=K(D);else{let f=e.indexOf(D);f!==-1?c[a]=n[f]:c[a]=i(D)}}return e.pop(),n.pop(),c}function l(s){if(typeof s!="object"||s===null)return s;if(Array.isArray(s))return r(s,l);if(s.constructor!==Object&&(o=u.get(s.constructor)))return o(s,l);let c={};e.push(s),n.push(c);for(let a in s){let D=s[a];if(typeof D!="object"||D===null)c[a]=D;else if(D.constructor!==Object&&(o=u.get(D.constructor)))c[a]=o(D,l);else if(ArrayBuffer.isView(D))c[a]=K(D);else{let f=e.indexOf(D);f!==-1?c[a]=n[f]:c[a]=l(D)}}return e.pop(),n.pop(),c}}});var j=Math.min,b=Math.max,tt=Math.round;var R=t=>({x:t,y:t}),fe={left:"right",right:"left",bottom:"top",top:"bottom"},Fe={start:"end",end:"start"};function Ft(t,e,n){return b(t,j(e,n))}function et(t,e){return typeof t=="function"?t(e):t}function P(t){return t.split("-")[0]}function st(t){return t.split("-")[1]}function dt(t){return t==="x"?"y":"x"}function mt(t){return t==="y"?"height":"width"}function W(t){return["top","bottom"].includes(P(t))?"y":"x"}function gt(t){return dt(W(t))}function wt(t,e,n){n===void 0&&(n=!1);let u=st(t),o=gt(t),r=mt(o),i=o==="x"?u===(n?"end":"start")?"right":"left":u==="start"?"bottom":"top";return e.reference[r]>e.floating[r]&&(i=J(i)),[i,J(i)]}function yt(t){let e=J(t);return[rt(t),e,rt(e)]}function rt(t){return t.replace(/start|end/g,e=>Fe[e])}function de(t,e,n){let u=["left","right"],o=["right","left"],r=["top","bottom"],i=["bottom","top"];switch(t){case"top":case"bottom":return n?e?o:u:e?u:o;case"left":case"right":return e?r:i;default:return[]}}function vt(t,e,n,u){let o=st(t),r=de(P(t),n==="start",u);return o&&(r=r.map(i=>i+"-"+o),e&&(r=r.concat(r.map(rt)))),r}function J(t){return t.replace(/left|right|bottom|top/g,e=>fe[e])}function me(t){return{top:0,right:0,bottom:0,left:0,...t}}function pt(t){return typeof t!="number"?me(t):{top:t,right:t,bottom:t,left:t}}function k(t){let{x:e,y:n,width:u,height:o}=t;return{width:u,height:o,top:n,left:e,right:e+u,bottom:n+o,x:e,y:n}}function bt(t,e,n){let{reference:u,floating:o}=t,r=W(e),i=gt(e),l=mt(i),s=P(e),c=r==="y",a=u.x+u.width/2-o.width/2,D=u.y+u.height/2-o.height/2,f=u[l]/2-o[l]/2,F;switch(s){case"top":F={x:a,y:u.y-o.height};break;case"bottom":F={x:a,y:u.y+u.height};break;case"right":F={x:u.x+u.width,y:D};break;case"left":F={x:u.x-o.width,y:D};break;default:F={x:u.x,y:u.y}}switch(st(e)){case"start":F[i]-=f*(n&&c?-1:1);break;case"end":F[i]+=f*(n&&c?-1:1);break}return F}var Rt=async(t,e,n)=>{let{placement:u="bottom",strategy:o="absolute",middleware:r=[],platform:i}=n,l=r.filter(Boolean),s=await(i.isRTL==null?void 0:i.isRTL(e)),c=await i.getElementRects({reference:t,floating:e,strategy:o}),{x:a,y:D}=bt(c,u,s),f=u,F={},d=0;for(let m=0;m<l.length;m++){let{name:g,fn:p}=l[m],{x:h,y:A,data:C,reset:E}=await p({x:a,y:D,initialPlacement:u,placement:f,strategy:o,middlewareData:F,rects:c,platform:i,elements:{reference:t,floating:e}});a=h??a,D=A??D,F={...F,[g]:{...F[g],...C}},E&&d<=50&&(d++,typeof E=="object"&&(E.placement&&(f=E.placement),E.rects&&(c=E.rects===!0?await i.getElementRects({reference:t,floating:e,strategy:o}):E.rects),{x:a,y:D}=bt(c,f,s)),m=-1)}return{x:a,y:D,placement:f,strategy:o,middlewareData:F}};async function At(t,e){var n;e===void 0&&(e={});let{x:u,y:o,platform:r,rects:i,elements:l,strategy:s}=t,{boundary:c="clippingAncestors",rootBoundary:a="viewport",elementContext:D="floating",altBoundary:f=!1,padding:F=0}=et(e,t),d=pt(F),g=l[f?D==="floating"?"reference":"floating":D],p=k(await r.getClippingRect({element:(n=await(r.isElement==null?void 0:r.isElement(g)))==null||n?g:g.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(l.floating)),boundary:c,rootBoundary:a,strategy:s})),h=D==="floating"?{x:u,y:o,width:i.floating.width,height:i.floating.height}:i.reference,A=await(r.getOffsetParent==null?void 0:r.getOffsetParent(l.floating)),C=await(r.isElement==null?void 0:r.isElement(A))?await(r.getScale==null?void 0:r.getScale(A))||{x:1,y:1}:{x:1,y:1},E=k(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:h,offsetParent:A,strategy:s}):h);return{top:(p.top-E.top+d.top)/C.y,bottom:(E.bottom-p.bottom+d.bottom)/C.y,left:(p.left-E.left+d.left)/C.x,right:(E.right-p.right+d.right)/C.x}}var St=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var n,u;let{placement:o,middlewareData:r,rects:i,initialPlacement:l,platform:s,elements:c}=e,{mainAxis:a=!0,crossAxis:D=!0,fallbackPlacements:f,fallbackStrategy:F="bestFit",fallbackAxisSideDirection:d="none",flipAlignment:m=!0,...g}=et(t,e);if((n=r.arrow)!=null&&n.alignmentOffset)return{};let p=P(o),h=W(l),A=P(l)===l,C=await(s.isRTL==null?void 0:s.isRTL(c.floating)),E=f||(A||!m?[J(l)]:yt(l)),V=d!=="none";!f&&V&&E.push(...vt(l,m,d,C));let it=[l,...E],Z=await At(e,g),_=[],x=((u=r.flip)==null?void 0:u.overflows)||[];if(a&&_.push(Z[p]),D){let v=wt(o,i,C);_.push(Z[v[0]],Z[v[1]])}if(x=[...x,{placement:o,overflows:_}],!_.every(v=>v<=0)){var z,Q;let v=(((z=r.flip)==null?void 0:z.index)||0)+1,q=it[v];if(q){var I;let O=D==="alignment"?h!==W(q):!1,L=((I=x[0])==null?void 0:I.overflows[0])>0;if(!O||L)return{data:{index:v,overflows:x},reset:{placement:q}}}let $=(Q=x.filter(O=>O.overflows[0]<=0).sort((O,L)=>O.overflows[1]-L.overflows[1])[0])==null?void 0:Q.placement;if(!$)switch(F){case"bestFit":{var G;let O=(G=x.filter(L=>{if(V){let H=W(L.placement);return H===h||H==="y"}return!0}).map(L=>[L.placement,L.overflows.filter(H=>H>0).reduce((H,ue)=>H+ue,0)]).sort((L,H)=>L[1]-H[1])[0])==null?void 0:G[0];O&&($=O);break}case"initialPlacement":$=l;break}if(o!==$)return{reset:{placement:$}}}return{}}}};function Ot(t){let e=j(...t.map(r=>r.left)),n=j(...t.map(r=>r.top)),u=b(...t.map(r=>r.right)),o=b(...t.map(r=>r.bottom));return{x:e,y:n,width:u-e,height:o-n}}function ge(t){let e=t.slice().sort((o,r)=>o.y-r.y),n=[],u=null;for(let o=0;o<e.length;o++){let r=e[o];!u||r.y-u.y>u.height/2?n.push([r]):n[n.length-1].push(r),u=r}return n.map(o=>k(Ot(o)))}var Lt=function(t){return t===void 0&&(t={}),{name:"inline",options:t,async fn(e){let{placement:n,elements:u,rects:o,platform:r,strategy:i}=e,{padding:l=2,x:s,y:c}=et(t,e),a=Array.from(await(r.getClientRects==null?void 0:r.getClientRects(u.reference))||[]),D=ge(a),f=k(Ot(a)),F=pt(l);function d(){if(D.length===2&&D[0].left>D[1].right&&s!=null&&c!=null)return D.find(g=>s>g.left-F.left&&s<g.right+F.right&&c>g.top-F.top&&c<g.bottom+F.bottom)||f;if(D.length>=2){if(W(n)==="y"){let x=D[0],z=D[D.length-1],Q=P(n)==="top",I=x.top,G=z.bottom,v=Q?x.left:z.left,q=Q?x.right:z.right,$=q-v,O=G-I;return{top:I,bottom:G,left:v,right:q,width:$,height:O,x:v,y:I}}let g=P(n)==="left",p=b(...D.map(x=>x.right)),h=j(...D.map(x=>x.left)),A=D.filter(x=>g?x.left===h:x.right===p),C=A[0].top,E=A[A.length-1].bottom,V=h,it=p,Z=it-V,_=E-C;return{top:C,bottom:E,left:V,right:it,width:Z,height:_,x:V,y:C}}return f}let m=await r.getElementRects({reference:{getBoundingClientRect:d},floating:u.floating,strategy:i});return o.reference.x!==m.reference.x||o.reference.y!==m.reference.y||o.reference.width!==m.reference.width||o.reference.height!==m.reference.height?{reset:{rects:m}}:{}}}};var Tt=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:n,y:u,placement:o}=e,{mainAxis:r=!0,crossAxis:i=!1,limiter:l={fn:g=>{let{x:p,y:h}=g;return{x:p,y:h}}},...s}=et(t,e),c={x:n,y:u},a=await At(e,s),D=W(P(o)),f=dt(D),F=c[f],d=c[D];if(r){let g=f==="y"?"top":"left",p=f==="y"?"bottom":"right",h=F+a[g],A=F-a[p];F=Ft(h,F,A)}if(i){let g=D==="y"?"top":"left",p=D==="y"?"bottom":"right",h=d+a[g],A=d-a[p];d=Ft(h,d,A)}let m=l.fn({...e,[f]:F,[D]:d});return{...m,data:{x:m.x-n,y:m.y-u,enabled:{[f]:r,[D]:i}}}}}};function lt(){return typeof window<"u"}function U(t){return kt(t)?(t.nodeName||"").toLowerCase():"#document"}function B(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function T(t){var e;return(e=(kt(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function kt(t){return lt()?t instanceof Node||t instanceof B(t).Node:!1}function w(t){return lt()?t instanceof Element||t instanceof B(t).Element:!1}function S(t){return lt()?t instanceof HTMLElement||t instanceof B(t).HTMLElement:!1}function Pt(t){return!lt()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof B(t).ShadowRoot}function Y(t){let{overflow:e,overflowX:n,overflowY:u,display:o}=y(t);return/auto|scroll|overlay|hidden|clip/.test(e+u+n)&&!["inline","contents"].includes(o)}function Mt(t){return["table","td","th"].includes(U(t))}function nt(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch{return!1}})}function Dt(t){let e=at(),n=w(t)?y(t):t;return["transform","translate","scale","rotate","perspective"].some(u=>n[u]?n[u]!=="none":!1)||(n.containerType?n.containerType!=="normal":!1)||!e&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!e&&(n.filter?n.filter!=="none":!1)||["transform","translate","scale","rotate","perspective","filter"].some(u=>(n.willChange||"").includes(u))||["paint","layout","strict","content"].some(u=>(n.contain||"").includes(u))}function Ht(t){let e=M(t);for(;S(e)&&!N(e);){if(Dt(e))return e;if(nt(e))return null;e=M(e)}return null}function at(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function N(t){return["html","body","#document"].includes(U(t))}function y(t){return B(t).getComputedStyle(t)}function ut(t){return w(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function M(t){if(U(t)==="html")return t;let e=t.assignedSlot||t.parentNode||Pt(t)&&t.host||T(t);return Pt(e)?e.host:e}function jt(t){let e=M(t);return N(e)?t.ownerDocument?t.ownerDocument.body:t.body:S(e)&&Y(e)?e:jt(e)}function ct(t,e,n){var u;e===void 0&&(e=[]),n===void 0&&(n=!0);let o=jt(t),r=o===((u=t.ownerDocument)==null?void 0:u.body),i=B(o);if(r){let l=ft(i);return e.concat(i,i.visualViewport||[],Y(o)?o:[],l&&n?ct(l):[])}return e.concat(o,ct(o,[],n))}function ft(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function Ut(t){let e=y(t),n=parseFloat(e.width)||0,u=parseFloat(e.height)||0,o=S(t),r=o?t.offsetWidth:n,i=o?t.offsetHeight:u,l=tt(n)!==r||tt(u)!==i;return l&&(n=r,u=i),{width:n,height:u,$:l}}function Nt(t){return w(t)?t:t.contextElement}function X(t){let e=Nt(t);if(!S(e))return R(1);let n=e.getBoundingClientRect(),{width:u,height:o,$:r}=Ut(e),i=(r?tt(n.width):n.width)/u,l=(r?tt(n.height):n.height)/o;return(!i||!Number.isFinite(i))&&(i=1),(!l||!Number.isFinite(l))&&(l=1),{x:i,y:l}}var pe=R(0);function Vt(t){let e=B(t);return!at()||!e.visualViewport?pe:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Ae(t,e,n){return e===void 0&&(e=!1),!n||e&&n!==B(t)?!1:e}function ot(t,e,n,u){e===void 0&&(e=!1),n===void 0&&(n=!1);let o=t.getBoundingClientRect(),r=Nt(t),i=R(1);e&&(u?w(u)&&(i=X(u)):i=X(t));let l=Ae(r,n,u)?Vt(r):R(0),s=(o.left+l.x)/i.x,c=(o.top+l.y)/i.y,a=o.width/i.x,D=o.height/i.y;if(r){let f=B(r),F=u&&w(u)?B(u):u,d=f,m=ft(d);for(;m&&u&&F!==d;){let g=X(m),p=m.getBoundingClientRect(),h=y(m),A=p.left+(m.clientLeft+parseFloat(h.paddingLeft))*g.x,C=p.top+(m.clientTop+parseFloat(h.paddingTop))*g.y;s*=g.x,c*=g.y,a*=g.x,D*=g.y,s+=A,c+=C,d=B(m),m=ft(d)}}return k({width:a,height:D,x:s,y:c})}function Et(t,e){let n=ut(t).scrollLeft;return e?e.left+n:ot(T(t)).left+n}function _t(t,e,n){n===void 0&&(n=!1);let u=t.getBoundingClientRect(),o=u.left+e.scrollLeft-(n?0:Et(t,u)),r=u.top+e.scrollTop;return{x:o,y:r}}function he(t){let{elements:e,rect:n,offsetParent:u,strategy:o}=t,r=o==="fixed",i=T(u),l=e?nt(e.floating):!1;if(u===i||l&&r)return n;let s={scrollLeft:0,scrollTop:0},c=R(1),a=R(0),D=S(u);if((D||!D&&!r)&&((U(u)!=="body"||Y(i))&&(s=ut(u)),S(u))){let F=ot(u);c=X(u),a.x=F.x+u.clientLeft,a.y=F.y+u.clientTop}let f=i&&!D&&!r?_t(i,s,!0):R(0);return{width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-s.scrollLeft*c.x+a.x+f.x,y:n.y*c.y-s.scrollTop*c.y+a.y+f.y}}function Ee(t){return Array.from(t.getClientRects())}function Ce(t){let e=T(t),n=ut(t),u=t.ownerDocument.body,o=b(e.scrollWidth,e.clientWidth,u.scrollWidth,u.clientWidth),r=b(e.scrollHeight,e.clientHeight,u.scrollHeight,u.clientHeight),i=-n.scrollLeft+Et(t),l=-n.scrollTop;return y(u).direction==="rtl"&&(i+=b(e.clientWidth,u.clientWidth)-o),{width:o,height:r,x:i,y:l}}function xe(t,e){let n=B(t),u=T(t),o=n.visualViewport,r=u.clientWidth,i=u.clientHeight,l=0,s=0;if(o){r=o.width,i=o.height;let c=at();(!c||c&&e==="fixed")&&(l=o.offsetLeft,s=o.offsetTop)}return{width:r,height:i,x:l,y:s}}function Be(t,e){let n=ot(t,!0,e==="fixed"),u=n.top+t.clientTop,o=n.left+t.clientLeft,r=S(t)?X(t):R(1),i=t.clientWidth*r.x,l=t.clientHeight*r.y,s=o*r.x,c=u*r.y;return{width:i,height:l,x:s,y:c}}function Wt(t,e,n){let u;if(e==="viewport")u=xe(t,n);else if(e==="document")u=Ce(T(t));else if(w(e))u=Be(e,n);else{let o=Vt(t);u={x:e.x-o.x,y:e.y-o.y,width:e.width,height:e.height}}return k(u)}function zt(t,e){let n=M(t);return n===e||!w(n)||N(n)?!1:y(n).position==="fixed"||zt(n,e)}function we(t,e){let n=e.get(t);if(n)return n;let u=ct(t,[],!1).filter(l=>w(l)&&U(l)!=="body"),o=null,r=y(t).position==="fixed",i=r?M(t):t;for(;w(i)&&!N(i);){let l=y(i),s=Dt(i);!s&&l.position==="fixed"&&(o=null),(r?!s&&!o:!s&&l.position==="static"&&!!o&&["absolute","fixed"].includes(o.position)||Y(i)&&!s&&zt(t,i))?u=u.filter(a=>a!==i):o=l,i=M(i)}return e.set(t,u),u}function ye(t){let{element:e,boundary:n,rootBoundary:u,strategy:o}=t,i=[...n==="clippingAncestors"?nt(e)?[]:we(e,this._c):[].concat(n),u],l=i[0],s=i.reduce((c,a)=>{let D=Wt(e,a,o);return c.top=b(D.top,c.top),c.right=j(D.right,c.right),c.bottom=j(D.bottom,c.bottom),c.left=b(D.left,c.left),c},Wt(e,l,o));return{width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}}function ve(t){let{width:e,height:n}=Ut(t);return{width:e,height:n}}function be(t,e,n){let u=S(e),o=T(e),r=n==="fixed",i=ot(t,!0,r,e),l={scrollLeft:0,scrollTop:0},s=R(0);function c(){s.x=Et(o)}if(u||!u&&!r)if((U(e)!=="body"||Y(o))&&(l=ut(e)),u){let F=ot(e,!0,r,e);s.x=F.x+e.clientLeft,s.y=F.y+e.clientTop}else o&&c();r&&!u&&o&&c();let a=o&&!u&&!r?_t(o,l):R(0),D=i.left+l.scrollLeft-s.x-a.x,f=i.top+l.scrollTop-s.y-a.y;return{x:D,y:f,width:i.width,height:i.height}}function ht(t){return y(t).position==="static"}function $t(t,e){if(!S(t)||y(t).position==="fixed")return null;if(e)return e(t);let n=t.offsetParent;return T(t)===n&&(n=n.ownerDocument.body),n}function It(t,e){let n=B(t);if(nt(t))return n;if(!S(t)){let o=M(t);for(;o&&!N(o);){if(w(o)&&!ht(o))return o;o=M(o)}return n}let u=$t(t,e);for(;u&&Mt(u)&&ht(u);)u=$t(u,e);return u&&N(u)&&ht(u)&&!Dt(u)?n:u||Ht(t)||n}var Re=async function(t){let e=this.getOffsetParent||It,n=this.getDimensions,u=await n(t.floating);return{reference:be(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:u.width,height:u.height}}};function Se(t){return y(t).direction==="rtl"}var Oe={convertOffsetParentRelativeRectToViewportRelativeRect:he,getDocumentElement:T,getClippingRect:ye,getOffsetParent:It,getElementRects:Re,getClientRects:Ee,getDimensions:ve,getScale:X,isElement:w,isRTL:Se};var qt=Tt,Yt=St;var Xt=Lt;var Kt=(t,e,n)=>{let u=new Map,o={platform:Oe,...n},r={...o.platform,_c:u};return Rt(t,e,{...o,platform:r})};var on=Object.hasOwnProperty;var Gt=ae(Qt(),1),Pe=(0,Gt.default)();var Jt=(t,e,n)=>{let u=new URL(t.getAttribute(e),n);t.setAttribute(e,u.pathname+u.hash)};function te(t,e){t.querySelectorAll(\'[href=""], [href^="./"], [href^="../"]\').forEach(n=>Jt(n,"href",e)),t.querySelectorAll(\'[src=""], [src^="./"], [src^="../"]\').forEach(n=>Jt(n,"src",e))}var ke=/<link rel="canonical" href="([^"]*)">/;async function ee(t){let e=await fetch(`${t}`);if(!e.headers.get("content-type")?.startsWith("text/html"))return e;let n=await e.clone().text(),[u,o]=n.match(ke)??[];return o?fetch(`${new URL(o,t)}`):e}var Me=new DOMParser,Ct=null;async function ne({clientX:t,clientY:e}){let n=Ct=this;if(n.dataset.noPopover==="true")return;async function u(m){let{x:g,y:p}=await Kt(n,m,{strategy:"fixed",middleware:[Xt({x:t,y:e}),qt(),Yt()]});Object.assign(m.style,{transform:`translate(${g.toFixed()}px, ${p.toFixed()}px)`})}function o(m){if(xt(),m.classList.add("active-popover"),u(m),i!==""){let g=`#popover-internal-${i.slice(1)}`,p=d.querySelector(g);p&&d.scroll({top:p.offsetTop-12,behavior:"instant"})}}let r=new URL(n.href),i=decodeURIComponent(r.hash);r.hash="",r.search="";let l=`popover-${n.pathname}`,s=document.getElementById(l);if(document.getElementById(l)){o(s);return}let c=await ee(r).catch(m=>{console.error(m)});if(!c)return;let[a]=c.headers.get("Content-Type").split(";"),[D,f]=a.split("/"),F=document.createElement("div");F.id=l,F.classList.add("popover");let d=document.createElement("div");switch(d.classList.add("popover-inner"),d.dataset.contentType=a??void 0,F.appendChild(d),D){case"image":let m=document.createElement("img");m.src=r.toString(),m.alt=r.pathname,d.appendChild(m);break;case"application":switch(f){case"pdf":let A=document.createElement("iframe");A.src=r.toString(),d.appendChild(A);break;default:break}break;default:let g=await c.text(),p=Me.parseFromString(g,"text/html");te(p,r),p.querySelectorAll("[id]").forEach(A=>{let C=`popover-internal-${A.id}`;A.id=C});let h=[...p.getElementsByClassName("popover-hint")];if(h.length===0)return;h.forEach(A=>d.appendChild(A))}document.getElementById(l)||(document.body.appendChild(F),Ct===this&&o(F))}function xt(){Ct=null,document.querySelectorAll(".popover").forEach(e=>e.classList.remove("active-popover"))}document.addEventListener("nav",()=>{let t=[...document.querySelectorAll("a.internal")];for(let e of t)e.addEventListener("mouseenter",ne),e.addEventListener("mouseleave",xt),window.addCleanup(()=>{e.removeEventListener("mouseenter",ne),e.removeEventListener("mouseleave",xt)})});\n';var custom_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
code[data-theme*=" "] {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

code[data-theme*=" "] span {
  color: var(--shiki-light);
}

[saved-theme=dark] code[data-theme*=" "] {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}

[saved-theme=dark] code[data-theme*=" "] span {
  color: var(--shiki-dark);
}

.callout {
  border: 1px solid var(--border);
  background-color: var(--bg);
  border-radius: 5px;
  padding: 0 1rem;
  overflow-y: hidden;
  box-sizing: border-box;
  --callout-icon-note: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>');
  --callout-icon-abstract: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>');
  --callout-icon-info: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>');
  --callout-icon-todo: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>');
  --callout-icon-tip: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg> ');
  --callout-icon-success: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ');
  --callout-icon-question: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> ');
  --callout-icon-warning: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>');
  --callout-icon-failure: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ');
  --callout-icon-danger: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> ');
  --callout-icon-bug: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="14" x="8" y="6" rx="4"></rect><path d="m19 7-3 2"></path><path d="m5 7 3 2"></path><path d="m19 19-3-2"></path><path d="m5 19 3-2"></path><path d="M20 13h-4"></path><path d="M4 13h4"></path><path d="m10 4 1 2"></path><path d="m14 4-1 2"></path></svg>');
  --callout-icon-example: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> ');
  --callout-icon-quote: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>');
  --callout-icon-fold: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpolyline points="6 9 12 15 18 9"%3E%3C/polyline%3E%3C/svg%3E');
}
.callout > .callout-content {
  display: grid;
  transition: grid-template-rows 0.3s ease;
}
.callout > .callout-content > .callout-content-inner {
  overflow: hidden;
}
.callout > .callout-content > .callout-content-inner > :first-child {
  margin-top: 0;
}
.callout[data-callout] {
  --color: #448aff;
  --border: #448aff44;
  --bg: #448aff10;
  --callout-icon: var(--callout-icon-note);
}
.callout[data-callout=abstract] {
  --color: #00b0ff;
  --border: #00b0ff44;
  --bg: #00b0ff10;
  --callout-icon: var(--callout-icon-abstract);
}
.callout[data-callout=info], .callout[data-callout=todo] {
  --color: #00b8d4;
  --border: #00b8d444;
  --bg: #00b8d410;
  --callout-icon: var(--callout-icon-info);
}
.callout[data-callout=todo] {
  --callout-icon: var(--callout-icon-todo);
}
.callout[data-callout=tip] {
  --color: #00bfa5;
  --border: #00bfa544;
  --bg: #00bfa510;
  --callout-icon: var(--callout-icon-tip);
}
.callout[data-callout=success] {
  --color: #09ad7a;
  --border: #09ad7144;
  --bg: #09ad7110;
  --callout-icon: var(--callout-icon-success);
}
.callout[data-callout=question] {
  --color: #dba642;
  --border: #dba64244;
  --bg: #dba64210;
  --callout-icon: var(--callout-icon-question);
}
.callout[data-callout=warning] {
  --color: #db8942;
  --border: #db894244;
  --bg: #db894210;
  --callout-icon: var(--callout-icon-warning);
}
.callout[data-callout=failure], .callout[data-callout=danger], .callout[data-callout=bug] {
  --color: #db4242;
  --border: #db424244;
  --bg: #db424210;
  --callout-icon: var(--callout-icon-failure);
}
.callout[data-callout=bug] {
  --callout-icon: var(--callout-icon-bug);
}
.callout[data-callout=danger] {
  --callout-icon: var(--callout-icon-danger);
}
.callout[data-callout=example] {
  --color: #7a43b5;
  --border: #7a43b544;
  --bg: #7a43b510;
  --callout-icon: var(--callout-icon-example);
}
.callout[data-callout=quote] {
  --color: var(--secondary);
  --border: var(--lightgray);
  --callout-icon: var(--callout-icon-quote);
}
.callout.is-collapsed > .callout-title > .fold-callout-icon {
  transform: rotateZ(-90deg);
}

.callout-title {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  padding: 1rem 0;
  color: var(--color);
  --icon-size: 18px;
}
.callout-title .fold-callout-icon {
  transition: transform 0.15s ease;
  opacity: 0.8;
  cursor: pointer;
  --callout-icon: var(--callout-icon-fold);
}
.callout-title > .callout-title-inner > p {
  color: var(--color);
  margin: 0;
}
.callout-title .callout-icon, .callout-title .fold-callout-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  flex: 0 0 var(--icon-size);
  background-size: var(--icon-size) var(--icon-size);
  background-position: center;
  background-color: var(--color);
  mask-image: var(--callout-icon);
  mask-size: var(--icon-size) var(--icon-size);
  mask-position: center;
  mask-repeat: no-repeat;
  padding: 0.2rem 0;
}
.callout-title .callout-title-inner {
  font-weight: 600;
}

html {
  scroll-behavior: smooth;
  text-size-adjust: none;
  overflow-x: hidden;
  width: 100vw;
}

body,
section {
  margin: 0;
  box-sizing: border-box;
  background-color: var(--light);
  font-family: var(--bodyFont);
  color: var(--darkgray);
}

.text-highlight {
  background-color: var(--textHighlight);
  padding: 0 0.1rem;
  border-radius: 5px;
}

::selection {
  background: color-mix(in srgb, var(--tertiary) 60%, rgba(255, 255, 255, 0));
  color: var(--darkgray);
}

p,
ul,
text,
a,
tr,
td,
li,
ol,
ul,
.katex,
.math {
  color: var(--darkgray);
  fill: var(--darkgray);
  hyphens: auto;
}

p,
ul,
text,
a,
li,
ol,
ul,
.katex,
.math {
  overflow-wrap: anywhere;
  /* tr and td removed from list of selectors for overflow-wrap, allowing them to use default 'normal' property value */
}

.math.math-display {
  text-align: center;
}

article > mjx-container.MathJax,
article blockquote > div > mjx-container.MathJax {
  display: flex;
}
article > mjx-container.MathJax > svg,
article blockquote > div > mjx-container.MathJax > svg {
  margin-left: auto;
  margin-right: auto;
}
article blockquote > div > mjx-container.MathJax > svg {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

strong {
  font-weight: 600;
}

a {
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  color: var(--secondary);
}
a:hover {
  color: var(--tertiary) !important;
}
a.internal {
  text-decoration: none;
  background-color: var(--highlight);
  padding: 0 0.1rem;
  border-radius: 5px;
  line-height: 1.4rem;
}
a.internal:has(> img) {
  background-color: transparent;
  border-radius: 0;
  padding: 0;
}
a.internal.tag-link::before {
  content: "#";
}
a.external .external-icon {
  height: 1ex;
  margin: 0 0.15em;
}
a.external .external-icon > path {
  fill: var(--dark);
}

.desktop-only {
  display: initial;
}
@media all and ((max-width: 800px)) {
  .desktop-only {
    display: none;
  }
}

.mobile-only {
  display: none;
}
@media all and ((max-width: 800px)) {
  .mobile-only {
    display: initial;
  }
}

.page {
  max-width: calc(1200px + 300px);
  margin: 0 auto;
}
.page article > h1 {
  font-size: 2rem;
}
.page article li:has(> input[type=checkbox]) {
  list-style-type: none;
  padding-left: 0;
}
.page article li:has(> input[type=checkbox]:checked) {
  text-decoration: line-through;
  text-decoration-color: var(--gray);
  color: var(--gray);
}
.page article li > * {
  margin-top: 0;
  margin-bottom: 0;
}
.page article p > strong {
  color: var(--dark);
}
.page > #quartz-body {
  display: grid;
  grid-template-columns: 320px auto 320px;
  grid-template-rows: auto auto auto;
  column-gap: 5px;
  row-gap: 5px;
  grid-template-areas: "grid-sidebar-left grid-header grid-sidebar-right"      "grid-sidebar-left grid-center grid-sidebar-right"      "grid-sidebar-left grid-footer grid-sidebar-right";
}
@media all and ((min-width: 800px) and (max-width: 1200px)) {
  .page > #quartz-body {
    grid-template-columns: 320px auto;
    grid-template-rows: auto auto auto auto;
    column-gap: 5px;
    row-gap: 5px;
    grid-template-areas: "grid-sidebar-left grid-header"      "grid-sidebar-left grid-center"      "grid-sidebar-left grid-sidebar-right"      "grid-sidebar-left grid-footer";
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body {
    grid-template-columns: auto;
    grid-template-rows: auto auto auto auto auto;
    column-gap: 5px;
    row-gap: 5px;
    grid-template-areas: "grid-sidebar-left"      "grid-header"      "grid-center"      "grid-sidebar-right"      "grid-footer";
  }
}
@media all and not ((min-width: 1200px)) {
  .page > #quartz-body {
    padding: 0 1rem;
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body {
    margin: 0 auto;
  }
}
.page > #quartz-body .sidebar {
  gap: 2rem;
  top: 0;
  box-sizing: border-box;
  padding: 6rem 2rem 2rem 2rem;
  display: flex;
  height: 100vh;
  position: sticky;
}
.page > #quartz-body .sidebar.left {
  z-index: 1;
  grid-area: grid-sidebar-left;
  flex-direction: column;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .sidebar.left {
    gap: 0;
    align-items: center;
    position: initial;
    display: flex;
    height: unset;
    flex-direction: row;
    padding: 0;
    padding-top: 2rem;
  }
}
.page > #quartz-body .sidebar.right {
  grid-area: grid-sidebar-right;
  margin-right: 0;
  flex-direction: column;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .sidebar.right {
    margin-left: inherit;
    margin-right: inherit;
  }
}
@media all and not ((min-width: 1200px)) {
  .page > #quartz-body .sidebar.right {
    position: initial;
    height: unset;
    width: 100%;
    flex-direction: row;
    padding: 0;
  }
  .page > #quartz-body .sidebar.right > * {
    flex: 1;
    max-height: 24rem;
  }
  .page > #quartz-body .sidebar.right > .toc {
    display: none;
  }
}
.page > #quartz-body .page-header, .page > #quartz-body .page-footer {
  margin-top: 1rem;
}
.page > #quartz-body .page-header {
  grid-area: grid-header;
  margin: 6rem 0 0 0;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .page-header {
    margin-top: 0;
    padding: 0;
  }
}
.page > #quartz-body .center > article {
  grid-area: grid-center;
}
.page > #quartz-body footer {
  grid-area: grid-footer;
}
.page > #quartz-body .center, .page > #quartz-body footer {
  max-width: 100%;
  min-width: 100%;
  margin-left: auto;
  margin-right: auto;
}
@media all and ((min-width: 800px) and (max-width: 1200px)) {
  .page > #quartz-body .center, .page > #quartz-body footer {
    margin-right: 0;
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .center, .page > #quartz-body footer {
    margin-right: 0;
    margin-left: 0;
  }
}
.page > #quartz-body footer {
  margin-left: 0;
}

.footnotes {
  margin-top: 2rem;
  border-top: 1px solid var(--lightgray);
}

input[type=checkbox] {
  transform: translateY(2px);
  color: var(--secondary);
  border: 1px solid var(--lightgray);
  border-radius: 3px;
  background-color: var(--light);
  position: relative;
  margin-inline-end: 0.2rem;
  margin-inline-start: -1.4rem;
  appearance: none;
  width: 16px;
  height: 16px;
}
input[type=checkbox]:checked {
  border-color: var(--secondary);
  background-color: var(--secondary);
}
input[type=checkbox]:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  display: block;
  border: solid var(--light);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

blockquote {
  margin: 1rem 0;
  border-left: 3px solid var(--secondary);
  padding-left: 1rem;
  transition: border-color 0.2s ease;
}

h1,
h2,
h3,
h4,
h5,
h6,
thead {
  font-family: var(--headerFont);
  color: var(--dark);
  font-weight: revert;
  margin-bottom: 0;
}
article > h1 > a[role=anchor],
article > h2 > a[role=anchor],
article > h3 > a[role=anchor],
article > h4 > a[role=anchor],
article > h5 > a[role=anchor],
article > h6 > a[role=anchor],
article > thead > a[role=anchor] {
  color: var(--dark);
  background-color: transparent;
}

h1[id] > a[href^="#"],
h2[id] > a[href^="#"],
h3[id] > a[href^="#"],
h4[id] > a[href^="#"],
h5[id] > a[href^="#"],
h6[id] > a[href^="#"] {
  margin: 0 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translateY(-0.1rem);
  font-family: var(--codeFont);
  user-select: none;
}
h1[id]:hover > a,
h2[id]:hover > a,
h3[id]:hover > a,
h4[id]:hover > a,
h5[id]:hover > a,
h6[id]:hover > a {
  opacity: 1;
}
h1:not([id]) > a[role=anchor],
h2:not([id]) > a[role=anchor],
h3:not([id]) > a[role=anchor],
h4:not([id]) > a[role=anchor],
h5:not([id]) > a[role=anchor],
h6:not([id]) > a[role=anchor] {
  display: none;
}

h1 {
  font-size: 1.75rem;
  margin-top: 2.25rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.4rem;
  margin-top: 1.9rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.12rem;
  margin-top: 1.62rem;
  margin-bottom: 1rem;
}

h4,
h5,
h6 {
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

figure[data-rehype-pretty-code-figure] {
  margin: 0;
  position: relative;
  line-height: 1.6rem;
  position: relative;
}
figure[data-rehype-pretty-code-figure] > [data-rehype-pretty-code-title] {
  font-family: var(--codeFont);
  font-size: 0.9rem;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--lightgray);
  width: fit-content;
  border-radius: 5px;
  margin-bottom: -0.5rem;
  color: var(--darkgray);
}
figure[data-rehype-pretty-code-figure] > pre {
  padding: 0;
}

pre {
  font-family: var(--codeFont);
  padding: 0 0.5rem;
  border-radius: 5px;
  overflow-x: auto;
  border: 1px solid var(--lightgray);
  position: relative;
}
pre:has(> code.mermaid) {
  border: none;
}
pre > code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  counter-reset: line;
  counter-increment: line 0;
  display: grid;
  padding: 0.5rem 0;
  overflow-x: auto;
}
pre > code [data-highlighted-chars] {
  background-color: var(--highlight);
  border-radius: 5px;
}
pre > code > [data-line] {
  padding: 0 0.25rem;
  box-sizing: border-box;
  border-left: 3px solid transparent;
}
pre > code > [data-line][data-highlighted-line] {
  background-color: var(--highlight);
  border-left: 3px solid var(--secondary);
}
pre > code > [data-line]::before {
  content: counter(line);
  counter-increment: line;
  width: 1rem;
  margin-right: 1rem;
  display: inline-block;
  text-align: right;
  color: rgba(115, 138, 148, 0.6);
}
pre > code[data-line-numbers-max-digits="2"] > [data-line]::before {
  width: 2rem;
}
pre > code[data-line-numbers-max-digits="3"] > [data-line]::before {
  width: 3rem;
}

code {
  font-size: 0.9em;
  color: var(--dark);
  font-family: var(--codeFont);
  border-radius: 5px;
  padding: 0.1rem 0.2rem;
  background: var(--lightgray);
}

tbody,
li,
p {
  line-height: 1.6rem;
}

.table-container {
  overflow-x: auto;
}
.table-container > table {
  margin: 1rem;
  padding: 1.5rem;
  border-collapse: collapse;
}
.table-container > table th,
.table-container > table td {
  min-width: 75px;
}
.table-container > table > * {
  line-height: 2rem;
}

th {
  text-align: left;
  padding: 0.4rem 0.7rem;
  border-bottom: 2px solid var(--gray);
}

td {
  padding: 0.2rem 0.7rem;
}

tr {
  border-bottom: 1px solid var(--lightgray);
}
tr:last-child {
  border-bottom: none;
}

img {
  max-width: 100%;
  border-radius: 5px;
  margin: 1rem 0;
  content-visibility: auto;
}

p > img + em {
  display: block;
  transform: translateY(-1rem);
}

hr {
  width: 100%;
  margin: 2rem auto;
  height: 1px;
  border: none;
  background-color: var(--lightgray);
}

audio,
video {
  width: 100%;
  border-radius: 5px;
}

.spacer {
  flex: 2 1 auto;
}

div:has(> .overflow) {
  max-height: 100%;
  overflow-y: hidden;
}

ul.overflow,
ol.overflow {
  max-height: 100%;
  overflow-y: auto;
  width: 100%;
  margin-bottom: 0;
  content: "";
  clear: both;
}
ul.overflow > li.overflow-end,
ol.overflow > li.overflow-end {
  height: 0.5rem;
  margin: 0;
}
ul.overflow.gradient-active,
ol.overflow.gradient-active {
  mask-image: linear-gradient(to bottom, black calc(100% - 50px), transparent 100%);
}

.transclude ul {
  padding-left: 1rem;
}

.katex-display {
  overflow-x: auto;
  overflow-y: hidden;
}

.external-embed.youtube,
iframe.pdf {
  aspect-ratio: 16/9;
  height: 100%;
  width: 100%;
  border-radius: 5px;
}

.navigation-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--secondary);
  transition: width 0.2s ease;
  z-index: 9999;
}

:root {
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  --spacing-2xl: 64px;
  --radius: 12px;
  --radius-lg: 16px;
  --max-width: 1000px;
  --content-width: 700px;
}

[data-theme=light] {
  --bg: #FDF0E4;
  --surface: rgba(255, 255, 255, 0.9);
  --surface-hover: rgba(255, 255, 255, 0.95);
  --text: #1A232E;
  --text-light: #4A5568;
  --text-lighter: #718096;
  --border: rgba(26, 35, 46, 0.1);
  --accent: #2B6CB0;
  --accent-hover: #2C5282;
}

[data-theme=dark] {
  --bg: #1A232E;
  --surface: rgba(253, 240, 228, 0.06);
  --surface-hover: rgba(253, 240, 228, 0.1);
  --text: #FDF0E4;
  --text-light: rgba(253, 240, 228, 0.8);
  --text-lighter: rgba(253, 240, 228, 0.6);
  --border: rgba(253, 240, 228, 0.1);
  --accent: #4299E1;
  --accent-hover: #3182CE;
}

* {
  font-family: "Kalam", "Comic Sans MS", cursive, system-ui;
}

body {
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.center {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--spacing-2xl);
}
header .center {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 60px;
}
header .page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
header .page-title a {
  color: var(--text);
  text-decoration: none;
}
header .search, header .darkmode {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}
header .search:hover, header .darkmode:hover {
  border-color: var(--accent);
  background: var(--surface-hover);
}
header .search input {
  background: transparent;
  border: none;
  color: var(--text);
  width: 200px;
  font-size: 0.9rem;
}
header .search input:focus {
  outline: none;
}
header .search input::placeholder {
  color: var(--text-lighter);
}

.article-title {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}
.article-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: -0.02em;
}

.recent-notes .recent-ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
  list-style: none;
  padding: 0;
  margin: 0;
}
.recent-notes .recent-li {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}
.recent-notes .recent-li:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--accent);
  background: var(--surface-hover);
}
.recent-notes .recent-li .section .desc h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.4;
}
.recent-notes .recent-li .section .desc h3 a {
  color: inherit;
  text-decoration: none;
}
.recent-notes .recent-li .section .desc h3 a:hover {
  color: var(--accent);
}
.recent-notes .recent-li .section .meta {
  color: var(--text-lighter);
  font-size: 0.85rem;
  margin-bottom: var(--spacing-sm);
}
.recent-notes .recent-li .section .tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: var(--spacing-sm) 0 0 0;
}
.recent-notes .recent-li .section .tags li .tag-link {
  background: var(--accent);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
  opacity: 0.8;
}
.recent-notes .recent-li .section .tags li .tag-link:hover {
  opacity: 1;
  transform: scale(1.05);
}

.single-post {
  max-width: var(--content-width);
  margin: 0 auto;
}
.single-post .content {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
}
.single-post .content h1, .single-post .content h2, .single-post .content h3, .single-post .content h4, .single-post .content h5, .single-post .content h6 {
  color: var(--text);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
}
.single-post .content h1 {
  font-size: 2rem;
  margin-top: 0;
}
.single-post .content h2 {
  font-size: 1.5rem;
}
.single-post .content h3 {
  font-size: 1.25rem;
}
.single-post .content p {
  color: var(--text-light);
  line-height: 1.7;
  margin-bottom: var(--spacing-sm);
}
.single-post .content code {
  background: var(--bg);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: "SF Mono", Monaco, monospace;
}
.single-post .content pre {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-sm);
  overflow-x: auto;
  margin: var(--spacing-sm) 0;
}
.single-post .content pre code {
  background: transparent;
  color: var(--text);
  padding: 0;
}
.single-post .content img {
  border-radius: var(--radius);
  width: 100%;
  height: auto;
  margin: var(--spacing-sm) 0;
}
.single-post .content blockquote {
  border-left: 4px solid var(--accent);
  background: var(--bg);
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-sm) 0;
  border-radius: 0 var(--radius) var(--radius) 0;
}
.single-post .content blockquote p {
  margin: 0;
}
.single-post .content ul, .single-post .content ol {
  padding-left: var(--spacing-md);
  margin: var(--spacing-sm) 0;
}
.single-post .content ul li, .single-post .content ol li {
  margin-bottom: 4px;
  color: var(--text-light);
}
.single-post .content a {
  color: var(--accent);
  text-decoration: none;
}
.single-post .content a:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}
.single-post .content table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-sm) 0;
  background: var(--bg);
  border-radius: var(--radius);
  overflow: hidden;
}
.single-post .content table th, .single-post .content table td {
  padding: var(--spacing-xs) var(--spacing-sm);
  text-align: left;
  border-bottom: 1px solid var(--border);
}
.single-post .content table th {
  background: var(--surface);
  font-weight: 600;
  color: var(--text);
}
.single-post .content table td {
  color: var(--text-light);
}

.content-meta {
  text-align: center;
  color: var(--text-lighter);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-lg);
}
.content-meta .meta-item {
  margin: 0 var(--spacing-xs);
}

.tag-list {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}
.tag-list .tag {
  background: var(--accent);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s ease;
}
.tag-list .tag:hover {
  background: var(--accent-hover);
  transform: scale(1.05);
}

footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg) 0;
}
footer .footer-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}
footer .footer-links a {
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}
footer .footer-links a:hover {
  color: var(--accent);
}

@media (max-width: 768px) {
  .center {
    padding: 0 var(--spacing-sm);
  }
  header .center {
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }
  .search input {
    width: 150px;
  }
  .recent-notes .recent-ul {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  .article-title h1 {
    font-size: 2rem;
  }
  .single-post .content {
    padding: var(--spacing-md);
  }
  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }
}
* {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}

button:focus,
input:focus,
a:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L3N0eWxlcyIsInNvdXJjZXMiOlsidmFyaWFibGVzLnNjc3MiLCJzeW50YXguc2NzcyIsImNhbGxvdXRzLnNjc3MiLCJiYXNlLnNjc3MiLCJjdXN0b20uc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQ0ZBO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTs7O0FBR0Y7RUFDRTtFQUNBOzs7QUFHRjtFQUNFOzs7QUNaRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQWVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBMUJBO0VBQ0U7RUFDQTs7QUFFQTtFQUNFOztBQUVBO0VBQ0U7O0FBb0JOO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUVFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUdFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUVBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBRUU7RUFDQTtFQUNBO0VBR0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFLGFGakphOzs7QUdoQmpCO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0FBQUE7RUFFRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBRUY7RUFDRTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBV0U7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFTRTtBQUNBOzs7QUFJQTtFQUNFOzs7QUFLRjtBQUFBO0VBRUU7O0FBQ0E7QUFBQTtFQUNFO0VBQ0E7O0FBR0o7RUFDRTtFQUNBOzs7QUFJSjtFQUNFLGFIN0RlOzs7QUdnRWpCO0VBQ0UsYUhqRWU7RUdrRWY7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBOztBQUdBO0VBQ0U7O0FBS047RUFDRTtFQUNBOztBQUVBO0VBQ0U7OztBQUtOO0VBQ0U7O0FBQ0E7RUFGRjtJQUdJOzs7O0FBSUo7RUFDRTs7QUFDQTtFQUZGO0lBR0k7Ozs7QUFJSjtFQUNFO0VBQ0E7O0FBRUU7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFSRjtJQVNJO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7OztBQUVGO0VBZkY7SUFnQkk7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7O0FBR0Y7RUF2QkY7SUF3Qkk7OztBQUVGO0VBMUJGO0lBMkJJOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUNBO0VBSkY7SUFLSTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTs7QUFDQTtFQUpGO0lBS0k7SUFDQTs7O0FBRUY7RUFSRjtJQVNJO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7O0VBQ0E7SUFDRTtJQUNBOztFQUVGO0lBQ0U7OztBQUlOO0VBRUU7O0FBR0Y7RUFDRTtFQUNBOztBQUNBO0VBSEY7SUFJSTtJQUNBOzs7QUFJSjtFQUNFOztBQUdGO0VBQ0U7O0FBR0Y7RUFFRTtFQUNBO0VBQ0E7RUFDQTs7QUFDQTtFQU5GO0lBT0k7OztBQUVGO0VBVEY7SUFVSTtJQUNBOzs7QUFHSjtFQUNFOzs7QUFLTjtFQUNFO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBS047RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFPRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQUNFO0VBQ0E7OztBQVVGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFDRTs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFDRTs7O0FBS0o7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtBQUFBO0VBR0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBSUo7RUFDRTs7QUFHRjtFQUNFOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtBQUFBO0VBR0U7OztBQUdGO0VBQ0U7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7QUFBQTtFQUVFOztBQUdGO0VBQ0U7OztBQUtOO0VBQ0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFOzs7QUFHRjtFQUNFOztBQUNBO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTs7O0FBR0Y7RUFDRTs7O0FBR0Y7RUFDRTtFQUNBOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTtFQUNBO0VBQ0E7RUFHQTtFQUNBOztBQUVBO0FBQUE7RUFDRTtFQUNBOztBQUdGO0FBQUE7RUFDRTs7O0FBS0Y7RUFDRTs7O0FBSUo7RUFDRTtFQUNBOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FDcm1CRjtFQUVFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUdBO0VBQ0E7RUFHQTtFQUNBOzs7QUFJRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBSUY7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUlGO0VBQ0U7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7OztBQUlGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFOzs7QUFNTjtFQUNFO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFNRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUlBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBRUE7RUFDRTs7QUFLTjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOzs7QUFVZDtFQUNFO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUlKO0VBQ0U7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBSUo7RUFDRTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOzs7QUFPUjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7OztBQUtKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7O0FBTU47RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7O0FBT1I7RUFDRTtJQUNFOztFQUdGO0lBQ0U7SUFDQTtJQUNBOztFQUdGO0lBQ0U7O0VBR0Y7SUFDRTtJQUNBOztFQUdGO0lBQ0U7O0VBR0Y7SUFDRTs7RUFHRjtJQUNFO0lBQ0E7SUFDQTs7O0FBS0o7RUFDRTs7O0FBSUY7RUFDRTs7O0FBR0Y7RUFDRTs7O0FBR0Y7RUFDRTtFQUNBOzs7QUFHRjtFQUNFOzs7QUFJRjtBQUFBO0FBQUE7RUFHRTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcInNhc3M6bWFwXCI7XG5cbi8qKlxuICogTGF5b3V0IGJyZWFrcG9pbnRzXG4gKiAkbW9iaWxlOiBzY3JlZW4gd2lkdGggYmVsb3cgdGhpcyB2YWx1ZSB3aWxsIHVzZSBtb2JpbGUgc3R5bGVzXG4gKiAkZGVza3RvcDogc2NyZWVuIHdpZHRoIGFib3ZlIHRoaXMgdmFsdWUgd2lsbCB1c2UgZGVza3RvcCBzdHlsZXNcbiAqIFNjcmVlbiB3aWR0aCBiZXR3ZWVuICRtb2JpbGUgYW5kICRkZXNrdG9wIHdpZHRoIHdpbGwgdXNlIHRoZSB0YWJsZXQgbGF5b3V0LlxuICogYXNzdW1pbmcgbW9iaWxlIDwgZGVza3RvcFxuICovXG4kYnJlYWtwb2ludHM6IChcbiAgbW9iaWxlOiA4MDBweCxcbiAgZGVza3RvcDogMTIwMHB4LFxuKTtcblxuJG1vYmlsZTogXCIobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSlcIjtcbiR0YWJsZXQ6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pIGFuZCAobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG4kZGVza3RvcDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG5cbiRwYWdlV2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9O1xuJHNpZGVQYW5lbFdpZHRoOiAzMjBweDsgLy8zODBweDtcbiR0b3BTcGFjaW5nOiA2cmVtO1xuJGJvbGRXZWlnaHQ6IDcwMDtcbiRzZW1pQm9sZFdlaWdodDogNjAwO1xuJG5vcm1hbFdlaWdodDogNDAwO1xuXG4kbW9iaWxlR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCJhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0XCJcXFxuICAgICAgXCJncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1mb290ZXJcIicsXG4pO1xuJHRhYmxldEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlclwiJyxcbik7XG4kZGVza3RvcEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0byAjeyRzaWRlUGFuZWxXaWR0aH1cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyIGdyaWQtc2lkZWJhci1yaWdodFwiJyxcbik7XG4iLCJjb2RlW2RhdGEtdGhlbWUqPVwiIFwiXSB7XG4gIGNvbG9yOiB2YXIoLS1zaGlraS1saWdodCk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaWtpLWxpZ2h0LWJnKTtcbn1cblxuY29kZVtkYXRhLXRoZW1lKj1cIiBcIl0gc3BhbiB7XG4gIGNvbG9yOiB2YXIoLS1zaGlraS1saWdodCk7XG59XG5cbltzYXZlZC10aGVtZT1cImRhcmtcIl0gY29kZVtkYXRhLXRoZW1lKj1cIiBcIl0ge1xuICBjb2xvcjogdmFyKC0tc2hpa2ktZGFyayk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaWtpLWRhcmstYmcpO1xufVxuXG5bc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIGNvZGVbZGF0YS10aGVtZSo9XCIgXCJdIHNwYW4ge1xuICBjb2xvcjogdmFyKC0tc2hpa2ktZGFyayk7XG59XG4iLCJAdXNlIFwiLi92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5AdXNlIFwic2Fzczpjb2xvclwiO1xuXG4uY2FsbG91dCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnKTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBwYWRkaW5nOiAwIDFyZW07XG4gIG92ZXJmbG93LXk6IGhpZGRlbjtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcblxuICAmID4gLmNhbGxvdXQtY29udGVudCB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICB0cmFuc2l0aW9uOiBncmlkLXRlbXBsYXRlLXJvd3MgMC4zcyBlYXNlO1xuXG4gICAgJiA+IC5jYWxsb3V0LWNvbnRlbnQtaW5uZXIge1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAgICAgJiA+IDpmaXJzdC1jaGlsZCB7XG4gICAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLS1jYWxsb3V0LWljb24tbm90ZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGxpbmUgeDE9XCIxOFwiIHkxPVwiMlwiIHgyPVwiMjJcIiB5Mj1cIjZcIj48L2xpbmU+PHBhdGggZD1cIk03LjUgMjAuNSAxOSA5bC00LTRMMy41IDE2LjUgMiAyMnpcIj48L3BhdGg+PC9zdmc+Jyk7XG4gIC0tY2FsbG91dC1pY29uLWFic3RyYWN0OiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCwgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cmVjdCB4PVwiOFwiIHk9XCIyXCIgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiNFwiIHJ4PVwiMVwiIHJ5PVwiMVwiPjwvcmVjdD48cGF0aCBkPVwiTTE2IDRoMmEyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJINmEyIDIgMCAwIDEtMi0yVjZhMiAyIDAgMCAxIDItMmgyXCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTIgMTFoNFwiPjwvcGF0aD48cGF0aCBkPVwiTTEyIDE2aDRcIj48L3BhdGg+PHBhdGggZD1cIk04IDExaC4wMVwiPjwvcGF0aD48cGF0aCBkPVwiTTggMTZoLjAxXCI+PC9wYXRoPjwvc3ZnPicpO1xuICAtLWNhbGxvdXQtaWNvbi1pbmZvOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCwgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCI+PC9jaXJjbGU+PGxpbmUgeDE9XCIxMlwiIHkxPVwiMTZcIiB4Mj1cIjEyXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCI4XCIgeDI9XCIxMi4wMVwiIHkyPVwiOFwiPjwvbGluZT48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24tdG9kbzogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0xMiAyMmM1LjUyMyAwIDEwLTQuNDc3IDEwLTEwUzE3LjUyMyAyIDEyIDIgMiA2LjQ3NyAyIDEyczQuNDc3IDEwIDEwIDEwelwiPjwvcGF0aD48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiPjwvcGF0aD48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24tdGlwOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNOC41IDE0LjVBMi41IDIuNSAwIDAgMCAxMSAxMmMwLTEuMzgtLjUtMi0xLTMtMS4wNzItMi4xNDMtLjIyNC00LjA1NCAyLTYgLjUgMi41IDIgNC45IDQgNi41IDIgMS42IDMgMy41IDMgNS41YTcgNyAwIDEgMS0xNCAwYzAtMS4xNTMuNDMzLTIuMjk0IDEtM2EyLjUgMi41IDAgMCAwIDIuNSAyLjV6XCI+PC9wYXRoPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tc3VjY2VzczogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIj48L3BvbHlsaW5lPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tcXVlc3Rpb246IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiPjwvY2lyY2xlPjxwYXRoIGQ9XCJNOS4wOSA5YTMgMyAwIDAgMSA1LjgzIDFjMCAyLTMgMy0zIDNcIj48L3BhdGg+PGxpbmUgeDE9XCIxMlwiIHkxPVwiMTdcIiB4Mj1cIjEyLjAxXCIgeTI9XCIxN1wiPjwvbGluZT48L3N2Zz4gJyk7XG4gIC0tY2FsbG91dC1pY29uLXdhcm5pbmc6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LCA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTNaXCI+PC9wYXRoPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjlcIiB4Mj1cIjEyXCIgeTI9XCIxM1wiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCIxN1wiIHgyPVwiMTIuMDFcIiB5Mj1cIjE3XCI+PC9saW5lPjwvc3ZnPicpO1xuICAtLWNhbGxvdXQtaWNvbi1mYWlsdXJlOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxsaW5lIHgxPVwiMThcIiB5MT1cIjZcIiB4Mj1cIjZcIiB5Mj1cIjE4XCI+PC9saW5lPjxsaW5lIHgxPVwiNlwiIHkxPVwiNlwiIHgyPVwiMThcIiB5Mj1cIjE4XCI+PC9saW5lPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tZGFuZ2VyOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwb2x5Z29uIHBvaW50cz1cIjEzIDIgMyAxNCAxMiAxNCAxMSAyMiAyMSAxMCAxMiAxMCAxMyAyXCI+PC9wb2x5Z29uPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tYnVnOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCwgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cmVjdCB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHg9XCI4XCIgeT1cIjZcIiByeD1cIjRcIj48L3JlY3Q+PHBhdGggZD1cIm0xOSA3LTMgMlwiPjwvcGF0aD48cGF0aCBkPVwibTUgNyAzIDJcIj48L3BhdGg+PHBhdGggZD1cIm0xOSAxOS0zLTJcIj48L3BhdGg+PHBhdGggZD1cIm01IDE5IDMtMlwiPjwvcGF0aD48cGF0aCBkPVwiTTIwIDEzaC00XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNCAxM2g0XCI+PC9wYXRoPjxwYXRoIGQ9XCJtMTAgNCAxIDJcIj48L3BhdGg+PHBhdGggZD1cIm0xNCA0LTEgMlwiPjwvcGF0aD48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24tZXhhbXBsZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48bGluZSB4MT1cIjhcIiB5MT1cIjZcIiB4Mj1cIjIxXCIgeTI9XCI2XCI+PC9saW5lPjxsaW5lIHgxPVwiOFwiIHkxPVwiMTJcIiB4Mj1cIjIxXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjhcIiB5MT1cIjE4XCIgeDI9XCIyMVwiIHkyPVwiMThcIj48L2xpbmU+PGxpbmUgeDE9XCIzXCIgeTE9XCI2XCIgeDI9XCIzLjAxXCIgeTI9XCI2XCI+PC9saW5lPjxsaW5lIHgxPVwiM1wiIHkxPVwiMTJcIiB4Mj1cIjMuMDFcIiB5Mj1cIjEyXCI+PC9saW5lPjxsaW5lIHgxPVwiM1wiIHkxPVwiMThcIiB4Mj1cIjMuMDFcIiB5Mj1cIjE4XCI+PC9saW5lPjwvc3ZnPiAnKTtcbiAgLS1jYWxsb3V0LWljb24tcXVvdGU6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LCA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMyAyMWMzIDAgNy0xIDctOFY1YzAtMS4yNS0uNzU2LTIuMDE3LTItMkg0Yy0xLjI1IDAtMiAuNzUtMiAxLjk3MlYxMWMwIDEuMjUuNzUgMiAyIDIgMSAwIDEgMCAxIDF2MWMwIDEtMSAyLTIgMnMtMSAuMDA4LTEgMS4wMzFWMjBjMCAxIDAgMSAxIDF6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTUgMjFjMyAwIDctMSA3LThWNWMwLTEuMjUtLjc1Ny0yLjAxNy0yLTJoLTRjLTEuMjUgMC0yIC43NS0yIDEuOTcyVjExYzAgMS4yNS43NSAyIDIgMmguNzVjMCAyLjI1LjI1IDQtMi43NSA0djNjMCAxIDAgMSAxIDF6XCI+PC9wYXRoPjwvc3ZnPicpO1xuICAtLWNhbGxvdXQtaWNvbi1mb2xkOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbCwlM0NzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiUzRSUzQ3BvbHlsaW5lIHBvaW50cz1cIjYgOSAxMiAxNSAxOCA5XCIlM0UlM0MvcG9seWxpbmUlM0UlM0Mvc3ZnJTNFJyk7XG5cbiAgJltkYXRhLWNhbGxvdXRdIHtcbiAgICAtLWNvbG9yOiAjNDQ4YWZmO1xuICAgIC0tYm9yZGVyOiAjNDQ4YWZmNDQ7XG4gICAgLS1iZzogIzQ0OGFmZjEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tbm90ZSk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cImFic3RyYWN0XCJdIHtcbiAgICAtLWNvbG9yOiAjMDBiMGZmO1xuICAgIC0tYm9yZGVyOiAjMDBiMGZmNDQ7XG4gICAgLS1iZzogIzAwYjBmZjEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tYWJzdHJhY3QpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJpbmZvXCJdLFxuICAmW2RhdGEtY2FsbG91dD1cInRvZG9cIl0ge1xuICAgIC0tY29sb3I6ICMwMGI4ZDQ7XG4gICAgLS1ib3JkZXI6ICMwMGI4ZDQ0NDtcbiAgICAtLWJnOiAjMDBiOGQ0MTA7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1pbmZvKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwidG9kb1wiXSB7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi10b2RvKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwidGlwXCJdIHtcbiAgICAtLWNvbG9yOiAjMDBiZmE1O1xuICAgIC0tYm9yZGVyOiAjMDBiZmE1NDQ7XG4gICAgLS1iZzogIzAwYmZhNTEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tdGlwKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwic3VjY2Vzc1wiXSB7XG4gICAgLS1jb2xvcjogIzA5YWQ3YTtcbiAgICAtLWJvcmRlcjogIzA5YWQ3MTQ0O1xuICAgIC0tYmc6ICMwOWFkNzExMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLXN1Y2Nlc3MpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJxdWVzdGlvblwiXSB7XG4gICAgLS1jb2xvcjogI2RiYTY0MjtcbiAgICAtLWJvcmRlcjogI2RiYTY0MjQ0O1xuICAgIC0tYmc6ICNkYmE2NDIxMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLXF1ZXN0aW9uKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwid2FybmluZ1wiXSB7XG4gICAgLS1jb2xvcjogI2RiODk0MjtcbiAgICAtLWJvcmRlcjogI2RiODk0MjQ0O1xuICAgIC0tYmc6ICNkYjg5NDIxMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLXdhcm5pbmcpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJmYWlsdXJlXCJdLFxuICAmW2RhdGEtY2FsbG91dD1cImRhbmdlclwiXSxcbiAgJltkYXRhLWNhbGxvdXQ9XCJidWdcIl0ge1xuICAgIC0tY29sb3I6ICNkYjQyNDI7XG4gICAgLS1ib3JkZXI6ICNkYjQyNDI0NDtcbiAgICAtLWJnOiAjZGI0MjQyMTA7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1mYWlsdXJlKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwiYnVnXCJdIHtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLWJ1Zyk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cImRhbmdlclwiXSB7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1kYW5nZXIpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJleGFtcGxlXCJdIHtcbiAgICAtLWNvbG9yOiAjN2E0M2I1O1xuICAgIC0tYm9yZGVyOiAjN2E0M2I1NDQ7XG4gICAgLS1iZzogIzdhNDNiNTEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tZXhhbXBsZSk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInF1b3RlXCJdIHtcbiAgICAtLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICAgIC0tYm9yZGVyOiB2YXIoLS1saWdodGdyYXkpO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tcXVvdGUpO1xuICB9XG5cbiAgJi5pcy1jb2xsYXBzZWQgPiAuY2FsbG91dC10aXRsZSA+IC5mb2xkLWNhbGxvdXQtaWNvbiB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVaKC05MGRlZyk7XG4gIH1cbn1cblxuLmNhbGxvdXQtdGl0bGUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZ2FwOiA1cHg7XG4gIHBhZGRpbmc6IDFyZW0gMDtcbiAgY29sb3I6IHZhcigtLWNvbG9yKTtcblxuICAtLWljb24tc2l6ZTogMThweDtcblxuICAmIC5mb2xkLWNhbGxvdXQtaWNvbiB7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMTVzIGVhc2U7XG4gICAgb3BhY2l0eTogMC44O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLWZvbGQpO1xuICB9XG5cbiAgJiA+IC5jYWxsb3V0LXRpdGxlLWlubmVyID4gcCB7XG4gICAgY29sb3I6IHZhcigtLWNvbG9yKTtcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICAuY2FsbG91dC1pY29uLFxuICAmIC5mb2xkLWNhbGxvdXQtaWNvbiB7XG4gICAgd2lkdGg6IHZhcigtLWljb24tc2l6ZSk7XG4gICAgaGVpZ2h0OiB2YXIoLS1pY29uLXNpemUpO1xuICAgIGZsZXg6IDAgMCB2YXIoLS1pY29uLXNpemUpO1xuXG4gICAgLy8gaWNvbiBzdXBwb3J0XG4gICAgYmFja2dyb3VuZC1zaXplOiB2YXIoLS1pY29uLXNpemUpIHZhcigtLWljb24tc2l6ZSk7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yKTtcbiAgICBtYXNrLWltYWdlOiB2YXIoLS1jYWxsb3V0LWljb24pO1xuICAgIG1hc2stc2l6ZTogdmFyKC0taWNvbi1zaXplKSB2YXIoLS1pY29uLXNpemUpO1xuICAgIG1hc2stcG9zaXRpb246IGNlbnRlcjtcbiAgICBtYXNrLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgIHBhZGRpbmc6IDAuMnJlbSAwO1xuICB9XG5cbiAgLmNhbGxvdXQtdGl0bGUtaW5uZXIge1xuICAgIGZvbnQtd2VpZ2h0OiAkc2VtaUJvbGRXZWlnaHQ7XG4gIH1cbn1cbiIsIkB1c2UgXCJzYXNzOm1hcFwiO1xuXG5AdXNlIFwiLi92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5AdXNlIFwiLi9zeW50YXguc2Nzc1wiO1xuQHVzZSBcIi4vY2FsbG91dHMuc2Nzc1wiO1xuXG5odG1sIHtcbiAgc2Nyb2xsLWJlaGF2aW9yOiBzbW9vdGg7XG4gIHRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgd2lkdGg6IDEwMHZ3O1xufVxuXG5ib2R5LFxuc2VjdGlvbiB7XG4gIG1hcmdpbjogMDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICBmb250LWZhbWlseTogdmFyKC0tYm9keUZvbnQpO1xuICBjb2xvcjogdmFyKC0tZGFya2dyYXkpO1xufVxuXG4udGV4dC1oaWdobGlnaHQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0SGlnaGxpZ2h0KTtcbiAgcGFkZGluZzogMCAwLjFyZW07XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cbjo6c2VsZWN0aW9uIHtcbiAgYmFja2dyb3VuZDogY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXRlcnRpYXJ5KSA2MCUsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkpO1xuICBjb2xvcjogdmFyKC0tZGFya2dyYXkpO1xufVxuXG5wLFxudWwsXG50ZXh0LFxuYSxcbnRyLFxudGQsXG5saSxcbm9sLFxudWwsXG4ua2F0ZXgsXG4ubWF0aCB7XG4gIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG4gIGZpbGw6IHZhcigtLWRhcmtncmF5KTtcbiAgaHlwaGVuczogYXV0bztcbn1cblxucCxcbnVsLFxudGV4dCxcbmEsXG5saSxcbm9sLFxudWwsXG4ua2F0ZXgsXG4ubWF0aCB7XG4gIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xuICAvKiB0ciBhbmQgdGQgcmVtb3ZlZCBmcm9tIGxpc3Qgb2Ygc2VsZWN0b3JzIGZvciBvdmVyZmxvdy13cmFwLCBhbGxvd2luZyB0aGVtIHRvIHVzZSBkZWZhdWx0ICdub3JtYWwnIHByb3BlcnR5IHZhbHVlICovXG59XG5cbi5tYXRoIHtcbiAgJi5tYXRoLWRpc3BsYXkge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxufVxuXG5hcnRpY2xlIHtcbiAgPiBtangtY29udGFpbmVyLk1hdGhKYXgsXG4gIGJsb2NrcXVvdGUgPiBkaXYgPiBtangtY29udGFpbmVyLk1hdGhKYXgge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgPiBzdmcge1xuICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgfVxuICB9XG4gIGJsb2NrcXVvdGUgPiBkaXYgPiBtangtY29udGFpbmVyLk1hdGhKYXggPiBzdmcge1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgfVxufVxuXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogJHNlbWlCb2xkV2VpZ2h0O1xufVxuXG5hIHtcbiAgZm9udC13ZWlnaHQ6ICRzZW1pQm9sZFdlaWdodDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XG4gIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuXG4gICY6aG92ZXIge1xuICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSkgIWltcG9ydGFudDtcbiAgfVxuXG4gICYuaW50ZXJuYWwge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oaWdobGlnaHQpO1xuICAgIHBhZGRpbmc6IDAgMC4xcmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICBsaW5lLWhlaWdodDogMS40cmVtO1xuXG4gICAgJjpoYXMoPiBpbWcpIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICAgIHBhZGRpbmc6IDA7XG4gICAgfVxuICAgICYudGFnLWxpbmsge1xuICAgICAgJjo6YmVmb3JlIHtcbiAgICAgICAgY29udGVudDogXCIjXCI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJi5leHRlcm5hbCAuZXh0ZXJuYWwtaWNvbiB7XG4gICAgaGVpZ2h0OiAxZXg7XG4gICAgbWFyZ2luOiAwIDAuMTVlbTtcblxuICAgID4gcGF0aCB7XG4gICAgICBmaWxsOiB2YXIoLS1kYXJrKTtcbiAgICB9XG4gIH1cbn1cblxuLmRlc2t0b3Atb25seSB7XG4gIGRpc3BsYXk6IGluaXRpYWw7XG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuXG4ubW9iaWxlLW9ubHkge1xuICBkaXNwbGF5OiBub25lO1xuICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgIGRpc3BsYXk6IGluaXRpYWw7XG4gIH1cbn1cblxuLnBhZ2Uge1xuICBtYXgtd2lkdGg6IGNhbGMoI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9ICsgMzAwcHgpO1xuICBtYXJnaW46IDAgYXV0bztcbiAgJiBhcnRpY2xlIHtcbiAgICAmID4gaDEge1xuICAgICAgZm9udC1zaXplOiAycmVtO1xuICAgIH1cblxuICAgICYgbGk6aGFzKD4gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdKSB7XG4gICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG4gICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgfVxuXG4gICAgJiBsaTpoYXMoPiBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCkge1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBsaW5lLXRocm91Z2g7XG4gICAgICB0ZXh0LWRlY29yYXRpb24tY29sb3I6IHZhcigtLWdyYXkpO1xuICAgICAgY29sb3I6IHZhcigtLWdyYXkpO1xuICAgIH1cblxuICAgICYgbGkgPiAqIHtcbiAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIH1cblxuICAgIHAgPiBzdHJvbmcge1xuICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgIH1cbiAgfVxuXG4gICYgPiAjcXVhcnR6LWJvZHkge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAje21hcC5nZXQoJGRlc2t0b3BHcmlkLCB0ZW1wbGF0ZUNvbHVtbnMpfTtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6ICN7bWFwLmdldCgkZGVza3RvcEdyaWQsIHRlbXBsYXRlUm93cyl9O1xuICAgIGNvbHVtbi1nYXA6ICN7bWFwLmdldCgkZGVza3RvcEdyaWQsIGNvbHVtbkdhcCl9O1xuICAgIHJvdy1nYXA6ICN7bWFwLmdldCgkZGVza3RvcEdyaWQsIHJvd0dhcCl9O1xuICAgIGdyaWQtdGVtcGxhdGUtYXJlYXM6ICN7bWFwLmdldCgkZGVza3RvcEdyaWQsIHRlbXBsYXRlQXJlYXMpfTtcblxuICAgIEBtZWRpYSBhbGwgYW5kICgkdGFibGV0KSB7XG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6ICN7bWFwLmdldCgkdGFibGV0R3JpZCwgdGVtcGxhdGVDb2x1bW5zKX07XG4gICAgICBncmlkLXRlbXBsYXRlLXJvd3M6ICN7bWFwLmdldCgkdGFibGV0R3JpZCwgdGVtcGxhdGVSb3dzKX07XG4gICAgICBjb2x1bW4tZ2FwOiAje21hcC5nZXQoJHRhYmxldEdyaWQsIGNvbHVtbkdhcCl9O1xuICAgICAgcm93LWdhcDogI3ttYXAuZ2V0KCR0YWJsZXRHcmlkLCByb3dHYXApfTtcbiAgICAgIGdyaWQtdGVtcGxhdGUtYXJlYXM6ICN7bWFwLmdldCgkdGFibGV0R3JpZCwgdGVtcGxhdGVBcmVhcyl9O1xuICAgIH1cbiAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAje21hcC5nZXQoJG1vYmlsZUdyaWQsIHRlbXBsYXRlQ29sdW1ucyl9O1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAje21hcC5nZXQoJG1vYmlsZUdyaWQsIHRlbXBsYXRlUm93cyl9O1xuICAgICAgY29sdW1uLWdhcDogI3ttYXAuZ2V0KCRtb2JpbGVHcmlkLCBjb2x1bW5HYXApfTtcbiAgICAgIHJvdy1nYXA6ICN7bWFwLmdldCgkbW9iaWxlR3JpZCwgcm93R2FwKX07XG4gICAgICBncmlkLXRlbXBsYXRlLWFyZWFzOiAje21hcC5nZXQoJG1vYmlsZUdyaWQsIHRlbXBsYXRlQXJlYXMpfTtcbiAgICB9XG5cbiAgICBAbWVkaWEgYWxsIGFuZCBub3QgKCRkZXNrdG9wKSB7XG4gICAgICBwYWRkaW5nOiAwIDFyZW07XG4gICAgfVxuICAgIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgICBtYXJnaW46IDAgYXV0bztcbiAgICB9XG5cbiAgICAmIC5zaWRlYmFyIHtcbiAgICAgIGdhcDogMnJlbTtcbiAgICAgIHRvcDogMDtcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICBwYWRkaW5nOiAkdG9wU3BhY2luZyAycmVtIDJyZW0gMnJlbTtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgICAgcG9zaXRpb246IHN0aWNreTtcbiAgICB9XG5cbiAgICAmIC5zaWRlYmFyLmxlZnQge1xuICAgICAgei1pbmRleDogMTtcbiAgICAgIGdyaWQtYXJlYTogZ3JpZC1zaWRlYmFyLWxlZnQ7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAgICAgZ2FwOiAwO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwb3NpdGlvbjogaW5pdGlhbDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgaGVpZ2h0OiB1bnNldDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgcGFkZGluZy10b3A6IDJyZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgJiAuc2lkZWJhci5yaWdodCB7XG4gICAgICBncmlkLWFyZWE6IGdyaWQtc2lkZWJhci1yaWdodDtcbiAgICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgICBtYXJnaW4tbGVmdDogaW5oZXJpdDtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiBpbmhlcml0O1xuICAgICAgfVxuICAgICAgQG1lZGlhIGFsbCBhbmQgbm90ICgkZGVza3RvcCkge1xuICAgICAgICBwb3NpdGlvbjogaW5pdGlhbDtcbiAgICAgICAgaGVpZ2h0OiB1bnNldDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgICYgPiAqIHtcbiAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgIG1heC1oZWlnaHQ6IDI0cmVtO1xuICAgICAgICB9XG4gICAgICAgICYgPiAudG9jIHtcbiAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgICYgLnBhZ2UtaGVhZGVyLFxuICAgICYgLnBhZ2UtZm9vdGVyIHtcbiAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgfVxuXG4gICAgJiAucGFnZS1oZWFkZXIge1xuICAgICAgZ3JpZC1hcmVhOiBncmlkLWhlYWRlcjtcbiAgICAgIG1hcmdpbjogJHRvcFNwYWNpbmcgMCAwIDA7XG4gICAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgICBtYXJnaW4tdG9wOiAwO1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgLmNlbnRlciA+IGFydGljbGUge1xuICAgICAgZ3JpZC1hcmVhOiBncmlkLWNlbnRlcjtcbiAgICB9XG5cbiAgICAmIGZvb3RlciB7XG4gICAgICBncmlkLWFyZWE6IGdyaWQtZm9vdGVyO1xuICAgIH1cblxuICAgICYgLmNlbnRlcixcbiAgICAmIGZvb3RlciB7XG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICBtaW4td2lkdGg6IDEwMCU7XG4gICAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgICAgIEBtZWRpYSBhbGwgYW5kICgkdGFibGV0KSB7XG4gICAgICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICAgIH1cbiAgICAgIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgICB9XG4gICAgfVxuICAgICYgZm9vdGVyIHtcbiAgICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgIH1cbiAgfVxufVxuXG4uZm9vdG5vdGVzIHtcbiAgbWFyZ2luLXRvcDogMnJlbTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG59XG5cbmlucHV0W3R5cGU9XCJjaGVja2JveFwiXSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgycHgpO1xuICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLWlubGluZS1lbmQ6IDAuMnJlbTtcbiAgbWFyZ2luLWlubGluZS1zdGFydDogLTEuNHJlbTtcbiAgYXBwZWFyYW5jZTogbm9uZTtcbiAgd2lkdGg6IDE2cHg7XG4gIGhlaWdodDogMTZweDtcblxuICAmOmNoZWNrZWQge1xuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuXG4gICAgJjo6YWZ0ZXIge1xuICAgICAgY29udGVudDogXCJcIjtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGxlZnQ6IDRweDtcbiAgICAgIHRvcDogMXB4O1xuICAgICAgd2lkdGg6IDRweDtcbiAgICAgIGhlaWdodDogOHB4O1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBib3JkZXI6IHNvbGlkIHZhcigtLWxpZ2h0KTtcbiAgICAgIGJvcmRlci13aWR0aDogMCAycHggMnB4IDA7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZyk7XG4gICAgfVxuICB9XG59XG5cbmJsb2NrcXVvdGUge1xuICBtYXJnaW46IDFyZW0gMDtcbiAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnkpO1xuICBwYWRkaW5nLWxlZnQ6IDFyZW07XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzIGVhc2U7XG59XG5cbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbnRoZWFkIHtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWhlYWRlckZvbnQpO1xuICBjb2xvcjogdmFyKC0tZGFyayk7XG4gIGZvbnQtd2VpZ2h0OiByZXZlcnQ7XG4gIG1hcmdpbi1ib3R0b206IDA7XG5cbiAgYXJ0aWNsZSA+ICYgPiBhW3JvbGU9XCJhbmNob3JcIl0ge1xuICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgfVxufVxuXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYge1xuICAmW2lkXSA+IGFbaHJlZl49XCIjXCJdIHtcbiAgICBtYXJnaW46IDAgMC41cmVtO1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzIGVhc2U7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0wLjFyZW0pO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1jb2RlRm9udCk7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIH1cblxuICAmW2lkXTpob3ZlciA+IGEge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cblxuICAmOm5vdChbaWRdKSA+IGFbcm9sZT1cImFuY2hvclwiXSB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuXG4vLyB0eXBvZ3JhcGh5IGltcHJvdmVtZW50c1xuaDEge1xuICBmb250LXNpemU6IDEuNzVyZW07XG4gIG1hcmdpbi10b3A6IDIuMjVyZW07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbmgyIHtcbiAgZm9udC1zaXplOiAxLjRyZW07XG4gIG1hcmdpbi10b3A6IDEuOXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cblxuaDMge1xuICBmb250LXNpemU6IDEuMTJyZW07XG4gIG1hcmdpbi10b3A6IDEuNjJyZW07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbmg0LFxuaDUsXG5oNiB7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgbWFyZ2luLXRvcDogMS41cmVtO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuXG5maWd1cmVbZGF0YS1yZWh5cGUtcHJldHR5LWNvZGUtZmlndXJlXSB7XG4gIG1hcmdpbjogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBsaW5lLWhlaWdodDogMS42cmVtO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgJiA+IFtkYXRhLXJlaHlwZS1wcmV0dHktY29kZS10aXRsZV0ge1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1jb2RlRm9udCk7XG4gICAgZm9udC1zaXplOiAwLjlyZW07XG4gICAgcGFkZGluZzogMC4xcmVtIDAuNXJlbTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgIHdpZHRoOiBmaXQtY29udGVudDtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgbWFyZ2luLWJvdHRvbTogLTAuNXJlbTtcbiAgICBjb2xvcjogdmFyKC0tZGFya2dyYXkpO1xuICB9XG5cbiAgJiA+IHByZSB7XG4gICAgcGFkZGluZzogMDtcbiAgfVxufVxuXG5wcmUge1xuICBmb250LWZhbWlseTogdmFyKC0tY29kZUZvbnQpO1xuICBwYWRkaW5nOiAwIDAuNXJlbTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgJjpoYXMoPiBjb2RlLm1lcm1haWQpIHtcbiAgICBib3JkZXI6IG5vbmU7XG4gIH1cblxuICAmID4gY29kZSB7XG4gICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICBjb3VudGVyLXJlc2V0OiBsaW5lO1xuICAgIGNvdW50ZXItaW5jcmVtZW50OiBsaW5lIDA7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBwYWRkaW5nOiAwLjVyZW0gMDtcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xuXG4gICAgJiBbZGF0YS1oaWdobGlnaHRlZC1jaGFyc10ge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGlnaGxpZ2h0KTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICB9XG5cbiAgICAmID4gW2RhdGEtbGluZV0ge1xuICAgICAgcGFkZGluZzogMCAwLjI1cmVtO1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdHJhbnNwYXJlbnQ7XG5cbiAgICAgICZbZGF0YS1oaWdobGlnaHRlZC1saW5lXSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhpZ2hsaWdodCk7XG4gICAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICAgIH1cblxuICAgICAgJjo6YmVmb3JlIHtcbiAgICAgICAgY29udGVudDogY291bnRlcihsaW5lKTtcbiAgICAgICAgY291bnRlci1pbmNyZW1lbnQ6IGxpbmU7XG4gICAgICAgIHdpZHRoOiAxcmVtO1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgICAgIGNvbG9yOiByZ2JhKDExNSwgMTM4LCAxNDgsIDAuNik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJltkYXRhLWxpbmUtbnVtYmVycy1tYXgtZGlnaXRzPVwiMlwiXSA+IFtkYXRhLWxpbmVdOjpiZWZvcmUge1xuICAgICAgd2lkdGg6IDJyZW07XG4gICAgfVxuXG4gICAgJltkYXRhLWxpbmUtbnVtYmVycy1tYXgtZGlnaXRzPVwiM1wiXSA+IFtkYXRhLWxpbmVdOjpiZWZvcmUge1xuICAgICAgd2lkdGg6IDNyZW07XG4gICAgfVxuICB9XG59XG5cbmNvZGUge1xuICBmb250LXNpemU6IDAuOWVtO1xuICBjb2xvcjogdmFyKC0tZGFyayk7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1jb2RlRm9udCk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgcGFkZGluZzogMC4xcmVtIDAuMnJlbTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbGlnaHRncmF5KTtcbn1cblxudGJvZHksXG5saSxcbnAge1xuICBsaW5lLWhlaWdodDogMS42cmVtO1xufVxuXG4udGFibGUtY29udGFpbmVyIHtcbiAgb3ZlcmZsb3cteDogYXV0bztcblxuICAmID4gdGFibGUge1xuICAgIG1hcmdpbjogMXJlbTtcbiAgICBwYWRkaW5nOiAxLjVyZW07XG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcblxuICAgIHRoLFxuICAgIHRkIHtcbiAgICAgIG1pbi13aWR0aDogNzVweDtcbiAgICB9XG5cbiAgICAmID4gKiB7XG4gICAgICBsaW5lLWhlaWdodDogMnJlbTtcbiAgICB9XG4gIH1cbn1cblxudGgge1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBwYWRkaW5nOiAwLjRyZW0gMC43cmVtO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQgdmFyKC0tZ3JheSk7XG59XG5cbnRkIHtcbiAgcGFkZGluZzogMC4ycmVtIDAuN3JlbTtcbn1cblxudHIge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgJjpsYXN0LWNoaWxkIHtcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xuICB9XG59XG5cbmltZyB7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBtYXJnaW46IDFyZW0gMDtcbiAgY29udGVudC12aXNpYmlsaXR5OiBhdXRvO1xufVxuXG5wID4gaW1nICsgZW0ge1xuICBkaXNwbGF5OiBibG9jaztcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcmVtKTtcbn1cblxuaHIge1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luOiAycmVtIGF1dG87XG4gIGhlaWdodDogMXB4O1xuICBib3JkZXI6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0Z3JheSk7XG59XG5cbmF1ZGlvLFxudmlkZW8ge1xuICB3aWR0aDogMTAwJTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xufVxuXG4uc3BhY2VyIHtcbiAgZmxleDogMiAxIGF1dG87XG59XG5cbmRpdjpoYXMoPiAub3ZlcmZsb3cpIHtcbiAgbWF4LWhlaWdodDogMTAwJTtcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xufVxuXG51bC5vdmVyZmxvdyxcbm9sLm92ZXJmbG93IHtcbiAgbWF4LWhlaWdodDogMTAwJTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgd2lkdGg6IDEwMCU7XG4gIG1hcmdpbi1ib3R0b206IDA7XG5cbiAgLy8gY2xlYXJmaXhcbiAgY29udGVudDogXCJcIjtcbiAgY2xlYXI6IGJvdGg7XG5cbiAgJiA+IGxpLm92ZXJmbG93LWVuZCB7XG4gICAgaGVpZ2h0OiAwLjVyZW07XG4gICAgbWFyZ2luOiAwO1xuICB9XG5cbiAgJi5ncmFkaWVudC1hY3RpdmUge1xuICAgIG1hc2staW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIGJsYWNrIGNhbGMoMTAwJSAtIDUwcHgpLCB0cmFuc3BhcmVudCAxMDAlKTtcbiAgfVxufVxuXG4udHJhbnNjbHVkZSB7XG4gIHVsIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDFyZW07XG4gIH1cbn1cblxuLmthdGV4LWRpc3BsYXkge1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICBvdmVyZmxvdy15OiBoaWRkZW47XG59XG5cbi5leHRlcm5hbC1lbWJlZC55b3V0dWJlLFxuaWZyYW1lLnBkZiB7XG4gIGFzcGVjdC1yYXRpbzogMTYgLyA5O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG59XG5cbi5uYXZpZ2F0aW9uLXByb2dyZXNzIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAwO1xuICBoZWlnaHQ6IDNweDtcbiAgYmFja2dyb3VuZDogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgdHJhbnNpdGlvbjogd2lkdGggMC4ycyBlYXNlO1xuICB6LWluZGV4OiA5OTk5O1xufVxuIiwiQHVzZSBcIi4vYmFzZS5zY3NzXCI7XG5cbi8vIENsZWFuIEJsb2cgRGVzaWduIFZhcmlhYmxlc1xuOnJvb3Qge1xuICAvLyBTaW1wbGlmaWVkIHNwYWNpbmdcbiAgLS1zcGFjaW5nLXhzOiA4cHg7XG4gIC0tc3BhY2luZy1zbTogMTZweDtcbiAgLS1zcGFjaW5nLW1kOiAyNHB4O1xuICAtLXNwYWNpbmctbGc6IDMycHg7XG4gIC0tc3BhY2luZy14bDogNDhweDtcbiAgLS1zcGFjaW5nLTJ4bDogNjRweDtcbiAgXG4gIC8vIE1vZGVybiByYWRpdXNcbiAgLS1yYWRpdXM6IDEycHg7XG4gIC0tcmFkaXVzLWxnOiAxNnB4O1xuICBcbiAgLy8gQ29udGFpbmVyIHdpZHRoXG4gIC0tbWF4LXdpZHRoOiAxMDAwcHg7XG4gIC0tY29udGVudC13aWR0aDogNzAwcHg7XG59XG5cbi8vIExpZ2h0IG1vZGUgY29sb3JzXG5bZGF0YS10aGVtZT1cImxpZ2h0XCJdIHtcbiAgLS1iZzogI0ZERjBFNDtcbiAgLS1zdXJmYWNlOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XG4gIC0tc3VyZmFjZS1ob3ZlcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjk1KTtcbiAgLS10ZXh0OiAjMUEyMzJFO1xuICAtLXRleHQtbGlnaHQ6ICM0QTU1Njg7XG4gIC0tdGV4dC1saWdodGVyOiAjNzE4MDk2O1xuICAtLWJvcmRlcjogcmdiYSgyNiwgMzUsIDQ2LCAwLjEpO1xuICAtLWFjY2VudDogIzJCNkNCMDtcbiAgLS1hY2NlbnQtaG92ZXI6ICMyQzUyODI7XG59XG5cbi8vIERhcmsgbW9kZSBjb2xvcnMgIFxuW2RhdGEtdGhlbWU9XCJkYXJrXCJdIHtcbiAgLS1iZzogIzFBMjMyRTtcbiAgLS1zdXJmYWNlOiByZ2JhKDI1MywgMjQwLCAyMjgsIDAuMDYpO1xuICAtLXN1cmZhY2UtaG92ZXI6IHJnYmEoMjUzLCAyNDAsIDIyOCwgMC4xKTtcbiAgLS10ZXh0OiAjRkRGMEU0O1xuICAtLXRleHQtbGlnaHQ6IHJnYmEoMjUzLCAyNDAsIDIyOCwgMC44KTtcbiAgLS10ZXh0LWxpZ2h0ZXI6IHJnYmEoMjUzLCAyNDAsIDIyOCwgMC42KTtcbiAgLS1ib3JkZXI6IHJnYmEoMjUzLCAyNDAsIDIyOCwgMC4xKTtcbiAgLS1hY2NlbnQ6ICM0Mjk5RTE7XG4gIC0tYWNjZW50LWhvdmVyOiAjMzE4MkNFO1xufVxuXG4vLyBHbG9iYWwgc3R5bGVzXG4qIHtcbiAgZm9udC1mYW1pbHk6IFwiS2FsYW1cIiwgXCJDb21pYyBTYW5zIE1TXCIsIGN1cnNpdmUsIHN5c3RlbS11aTtcbn1cblxuYm9keSB7XG4gIGJhY2tncm91bmQ6IHZhcigtLWJnKTtcbiAgY29sb3I6IHZhcigtLXRleHQpO1xuICBsaW5lLWhlaWdodDogMS42O1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi5jZW50ZXIge1xuICBtYXgtd2lkdGg6IHZhcigtLW1heC13aWR0aCk7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBwYWRkaW5nOiAwIHZhcigtLXNwYWNpbmctbWQpO1xufVxuXG4vLyBDbGVhbiBoZWFkZXJcbmhlYWRlciB7XG4gIHBvc2l0aW9uOiBzdGlja3k7XG4gIHRvcDogMDtcbiAgei1pbmRleDogMTAwO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlKTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDIwcHgpO1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tYm9yZGVyKTtcbiAgbWFyZ2luLWJvdHRvbTogdmFyKC0tc3BhY2luZy0yeGwpO1xuICBcbiAgLmNlbnRlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBwYWRkaW5nOiB2YXIoLS1zcGFjaW5nLXNtKSB2YXIoLS1zcGFjaW5nLW1kKTtcbiAgICBtaW4taGVpZ2h0OiA2MHB4O1xuICB9XG4gIFxuICAucGFnZS10aXRsZSB7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBtYXJnaW46IDA7XG4gICAgXG4gICAgYSB7XG4gICAgICBjb2xvcjogdmFyKC0tdGV4dCk7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgfVxuICB9XG4gIFxuICAuc2VhcmNoLCAuZGFya21vZGUge1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7XG4gICAgYm9yZGVyLXJhZGl1czogdmFyKC0tcmFkaXVzKTtcbiAgICBwYWRkaW5nOiB2YXIoLS1zcGFjaW5nLXhzKSB2YXIoLS1zcGFjaW5nLXNtKTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dCk7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgXG4gICAgJjpob3ZlciB7XG4gICAgICBib3JkZXItY29sb3I6IHZhcigtLWFjY2VudCk7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLWhvdmVyKTtcbiAgICB9XG4gIH1cbiAgXG4gIC5zZWFyY2ggaW5wdXQge1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dCk7XG4gICAgd2lkdGg6IDIwMHB4O1xuICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICAgIFxuICAgICY6Zm9jdXMge1xuICAgICAgb3V0bGluZTogbm9uZTtcbiAgICB9XG4gICAgXG4gICAgJjo6cGxhY2Vob2xkZXIge1xuICAgICAgY29sb3I6IHZhcigtLXRleHQtbGlnaHRlcik7XG4gICAgfVxuICB9XG59XG5cbi8vIEJsb2cgdGl0bGVcbi5hcnRpY2xlLXRpdGxlIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiB2YXIoLS1zcGFjaW5nLTJ4bCk7XG4gIFxuICBoMSB7XG4gICAgZm9udC1zaXplOiAyLjVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dCk7XG4gICAgbWFyZ2luOiAwIDAgdmFyKC0tc3BhY2luZy1zbSkgMDtcbiAgICBsZXR0ZXItc3BhY2luZzogLTAuMDJlbTtcbiAgfVxufVxuXG4vLyBCbG9nIHBvc3RzIGdyaWRcbi5yZWNlbnQtbm90ZXMge1xuICAucmVjZW50LXVsIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMzAwcHgsIDFmcikpO1xuICAgIGdhcDogdmFyKC0tc3BhY2luZy1tZCk7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBwYWRkaW5nOiAwO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuICBcbiAgLnJlY2VudC1saSB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZSk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyKTtcbiAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1yYWRpdXMtbGcpO1xuICAgIHBhZGRpbmc6IHZhcigtLXNwYWNpbmctbWQpO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDEwcHgpO1xuICAgIFxuICAgICY6aG92ZXIge1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xuICAgICAgYm94LXNoYWRvdzogMCA4cHggMjVweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gICAgICBib3JkZXItY29sb3I6IHZhcigtLWFjY2VudCk7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLWhvdmVyKTtcbiAgICB9XG4gICAgXG4gICAgLnNlY3Rpb24ge1xuICAgICAgLmRlc2MgaDMge1xuICAgICAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQpO1xuICAgICAgICBtYXJnaW46IDAgMCB2YXIoLS1zcGFjaW5nLXhzKSAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMS40O1xuICAgICAgICBcbiAgICAgICAgYSB7XG4gICAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICAgIFxuICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLWFjY2VudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC5tZXRhIHtcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbGlnaHRlcik7XG4gICAgICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogdmFyKC0tc3BhY2luZy1zbSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC50YWdzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZ2FwOiB2YXIoLS1zcGFjaW5nLXhzKTtcbiAgICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgICAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICBtYXJnaW46IHZhcigtLXNwYWNpbmctc20pIDAgMCAwO1xuICAgICAgICBcbiAgICAgICAgbGkge1xuICAgICAgICAgIC50YWctbGluayB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1hY2NlbnQpO1xuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMC43NXJlbTtcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjg7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBTaW5nbGUgcG9zdCBzdHlsaW5nXG4uc2luZ2xlLXBvc3Qge1xuICBtYXgtd2lkdGg6IHZhcigtLWNvbnRlbnQtd2lkdGgpO1xuICBtYXJnaW46IDAgYXV0bztcbiAgXG4gIC5jb250ZW50IHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlKTtcbiAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1yYWRpdXMtbGcpO1xuICAgIHBhZGRpbmc6IHZhcigtLXNwYWNpbmcteGwpO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7XG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDEwcHgpO1xuICAgIFxuICAgIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xuICAgICAgY29sb3I6IHZhcigtLXRleHQpO1xuICAgICAgbWFyZ2luLXRvcDogdmFyKC0tc3BhY2luZy1sZyk7XG4gICAgICBtYXJnaW4tYm90dG9tOiB2YXIoLS1zcGFjaW5nLXNtKTtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxLjM7XG4gICAgfVxuICAgIFxuICAgIGgxIHtcbiAgICAgIGZvbnQtc2l6ZTogMnJlbTtcbiAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgfVxuICAgIFxuICAgIGgyIHtcbiAgICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICAgIH1cbiAgICBcbiAgICBoMyB7XG4gICAgICBmb250LXNpemU6IDEuMjVyZW07XG4gICAgfVxuICAgIFxuICAgIHAge1xuICAgICAgY29sb3I6IHZhcigtLXRleHQtbGlnaHQpO1xuICAgICAgbGluZS1oZWlnaHQ6IDEuNztcbiAgICAgIG1hcmdpbi1ib3R0b206IHZhcigtLXNwYWNpbmctc20pO1xuICAgIH1cbiAgICBcbiAgICBjb2RlIHtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJnKTtcbiAgICAgIGNvbG9yOiB2YXIoLS1hY2NlbnQpO1xuICAgICAgcGFkZGluZzogMnB4IDZweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgIGZvbnQtc2l6ZTogMC45ZW07XG4gICAgICBmb250LWZhbWlseTogJ1NGIE1vbm8nLCBNb25hY28sIG1vbm9zcGFjZTtcbiAgICB9XG4gICAgXG4gICAgcHJlIHtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJnKTtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7XG4gICAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1yYWRpdXMpO1xuICAgICAgcGFkZGluZzogdmFyKC0tc3BhY2luZy1zbSk7XG4gICAgICBvdmVyZmxvdy14OiBhdXRvO1xuICAgICAgbWFyZ2luOiB2YXIoLS1zcGFjaW5nLXNtKSAwO1xuICAgICAgXG4gICAgICBjb2RlIHtcbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaW1nIHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLXJhZGl1cyk7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogYXV0bztcbiAgICAgIG1hcmdpbjogdmFyKC0tc3BhY2luZy1zbSkgMDtcbiAgICB9XG4gICAgXG4gICAgYmxvY2txdW90ZSB7XG4gICAgICBib3JkZXItbGVmdDogNHB4IHNvbGlkIHZhcigtLWFjY2VudCk7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZyk7XG4gICAgICBwYWRkaW5nOiB2YXIoLS1zcGFjaW5nLXNtKSB2YXIoLS1zcGFjaW5nLW1kKTtcbiAgICAgIG1hcmdpbjogdmFyKC0tc3BhY2luZy1zbSkgMDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDAgdmFyKC0tcmFkaXVzKSB2YXIoLS1yYWRpdXMpIDA7XG4gICAgICBcbiAgICAgIHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHVsLCBvbCB7XG4gICAgICBwYWRkaW5nLWxlZnQ6IHZhcigtLXNwYWNpbmctbWQpO1xuICAgICAgbWFyZ2luOiB2YXIoLS1zcGFjaW5nLXNtKSAwO1xuICAgICAgXG4gICAgICBsaSB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDRweDtcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbGlnaHQpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBhIHtcbiAgICAgIGNvbG9yOiB2YXIoLS1hY2NlbnQpO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgXG4gICAgICAmOmhvdmVyIHtcbiAgICAgICAgY29sb3I6IHZhcigtLWFjY2VudC1ob3Zlcik7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB0YWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gICAgICBtYXJnaW46IHZhcigtLXNwYWNpbmctc20pIDA7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZyk7XG4gICAgICBib3JkZXItcmFkaXVzOiB2YXIoLS1yYWRpdXMpO1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIFxuICAgICAgdGgsIHRkIHtcbiAgICAgICAgcGFkZGluZzogdmFyKC0tc3BhY2luZy14cykgdmFyKC0tc3BhY2luZy1zbSk7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aCB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRkIHtcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbGlnaHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBDb250ZW50IG1ldGEgKGRhdGUsIHJlYWRpbmcgdGltZSlcbi5jb250ZW50LW1ldGEge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWxpZ2h0ZXIpO1xuICBmb250LXNpemU6IDAuOXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogdmFyKC0tc3BhY2luZy1sZyk7XG4gIFxuICAubWV0YS1pdGVtIHtcbiAgICBtYXJnaW46IDAgdmFyKC0tc3BhY2luZy14cyk7XG4gIH1cbn1cblxuLy8gVGFnIGxpc3Qgc3R5bGluZ1xuLnRhZy1saXN0IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGdhcDogdmFyKC0tc3BhY2luZy14cyk7XG4gIG1hcmdpbi1ib3R0b206IHZhcigtLXNwYWNpbmctbGcpO1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIFxuICAudGFnIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1hY2NlbnQpO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgIGZvbnQtc2l6ZTogMC44cmVtO1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICAgIFxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50LWhvdmVyKTtcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XG4gICAgfVxuICB9XG59XG5cbi8vIEZvb3RlclxuZm9vdGVyIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZSk7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO1xuICBtYXJnaW4tdG9wOiB2YXIoLS1zcGFjaW5nLTJ4bCk7XG4gIHBhZGRpbmc6IHZhcigtLXNwYWNpbmctbGcpIDA7XG4gIFxuICAuZm9vdGVyLWxpbmtzIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGdhcDogdmFyKC0tc3BhY2luZy1tZCk7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICAgIFxuICAgIGEge1xuICAgICAgY29sb3I6IHZhcigtLXRleHQtbGlnaHQpO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgZm9udC1zaXplOiAwLjlyZW07XG4gICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XG4gICAgICBcbiAgICAgICY6aG92ZXIge1xuICAgICAgICBjb2xvcjogdmFyKC0tYWNjZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gUmVzcG9uc2l2ZSBkZXNpZ25cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuY2VudGVyIHtcbiAgICBwYWRkaW5nOiAwIHZhcigtLXNwYWNpbmctc20pO1xuICB9XG4gIFxuICBoZWFkZXIgLmNlbnRlciB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IHZhcigtLXNwYWNpbmctc20pO1xuICAgIHBhZGRpbmc6IHZhcigtLXNwYWNpbmctc20pO1xuICB9XG4gIFxuICAuc2VhcmNoIGlucHV0IHtcbiAgICB3aWR0aDogMTUwcHg7XG4gIH1cbiAgXG4gIC5yZWNlbnQtbm90ZXMgLnJlY2VudC11bCB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gICAgZ2FwOiB2YXIoLS1zcGFjaW5nLXNtKTtcbiAgfVxuICBcbiAgLmFydGljbGUtdGl0bGUgaDEge1xuICAgIGZvbnQtc2l6ZTogMnJlbTtcbiAgfVxuICBcbiAgLnNpbmdsZS1wb3N0IC5jb250ZW50IHtcbiAgICBwYWRkaW5nOiB2YXIoLS1zcGFjaW5nLW1kKTtcbiAgfVxuICBcbiAgLmZvb3Rlci1saW5rcyB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogdmFyKC0tc3BhY2luZy1zbSk7XG4gIH1cbn1cblxuLy8gU21vb3RoIHRyYW5zaXRpb25zXG4qIHtcbiAgdHJhbnNpdGlvbjogY29sb3IgMC4ycyBlYXNlLCBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgZWFzZSwgYm9yZGVyLWNvbG9yIDAuMnMgZWFzZTtcbn1cblxuLy8gU2Nyb2xsYmFyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgd2lkdGg6IDZweDtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tYm9yZGVyKTtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50KTtcbn1cblxuLy8gRm9jdXMgc3RhdGVzIGZvciBhY2Nlc3NpYmlsaXR5XG5idXR0b246Zm9jdXMsXG5pbnB1dDpmb2N1cyxcbmE6Zm9jdXMge1xuICBvdXRsaW5lOiAycHggc29saWQgdmFyKC0tYWNjZW50KTtcbiAgb3V0bGluZS1vZmZzZXQ6IDJweDtcbn1cbiJdfQ== */`;var popover_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
@keyframes dropin {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  1% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
.popover {
  z-index: 999;
  position: fixed;
  overflow: visible;
  padding: 1rem;
  left: 0;
  top: 0;
  will-change: transform;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.popover > .popover-inner {
  position: relative;
  width: 30rem;
  max-height: 20rem;
  padding: 0 1rem 1rem 1rem;
  font-weight: initial;
  font-style: initial;
  line-height: normal;
  font-size: initial;
  font-family: var(--bodyFont);
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  box-shadow: 6px 6px 36px 0 rgba(0, 0, 0, 0.25);
  overflow: auto;
  overscroll-behavior: contain;
  white-space: normal;
  user-select: none;
  cursor: default;
}
.popover > .popover-inner[data-content-type][data-content-type*=pdf], .popover > .popover-inner[data-content-type][data-content-type*=image] {
  padding: 0;
  max-height: 100%;
}
.popover > .popover-inner[data-content-type][data-content-type*=image] img {
  margin: 0;
  border-radius: 0;
  display: block;
}
.popover > .popover-inner[data-content-type][data-content-type*=pdf] iframe {
  width: 100%;
}
.popover h1 {
  font-size: 1.5rem;
}
@media all and ((max-width: 800px)) {
  .popover {
    display: none !important;
  }
}

.active-popover,
.popover:hover {
  animation: dropin 0.3s ease;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL1VzZXJzL3NpcmJvci9Qcm9qZWN0cy9TaXJib3IvcXVhcnR6L2NvbXBvbmVudHMvc3R5bGVzIiwic291cmNlcyI6WyIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3MiLCJwb3BvdmVyLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUNBQTtFQUNFO0lBQ0U7SUFDQTs7RUFFRjtJQUNFOztFQUVGO0lBQ0U7SUFDQTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQWlEQTtFQUNBO0VBQ0EsWUFDRTs7QUFsREY7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBSUE7RUFFRTtFQUNBOztBQUlBO0VBQ0U7RUFDQTtFQUNBOztBQUtGO0VBQ0U7O0FBS047RUFDRTs7QUFTRjtFQTlERjtJQStESTs7OztBQUlKO0FBQUE7RUFFRTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwic2FzczptYXBcIjtcblxuLyoqXG4gKiBMYXlvdXQgYnJlYWtwb2ludHNcbiAqICRtb2JpbGU6IHNjcmVlbiB3aWR0aCBiZWxvdyB0aGlzIHZhbHVlIHdpbGwgdXNlIG1vYmlsZSBzdHlsZXNcbiAqICRkZXNrdG9wOiBzY3JlZW4gd2lkdGggYWJvdmUgdGhpcyB2YWx1ZSB3aWxsIHVzZSBkZXNrdG9wIHN0eWxlc1xuICogU2NyZWVuIHdpZHRoIGJldHdlZW4gJG1vYmlsZSBhbmQgJGRlc2t0b3Agd2lkdGggd2lsbCB1c2UgdGhlIHRhYmxldCBsYXlvdXQuXG4gKiBhc3N1bWluZyBtb2JpbGUgPCBkZXNrdG9wXG4gKi9cbiRicmVha3BvaW50czogKFxuICBtb2JpbGU6IDgwMHB4LFxuICBkZXNrdG9wOiAxMjAwcHgsXG4pO1xuXG4kbW9iaWxlOiBcIihtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KVwiO1xuJHRhYmxldDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSkgYW5kIChtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcbiRkZXNrdG9wOiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcblxuJHBhZ2VXaWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX07XG4kc2lkZVBhbmVsV2lkdGg6IDMyMHB4OyAvLzM4MHB4O1xuJHRvcFNwYWNpbmc6IDZyZW07XG4kYm9sZFdlaWdodDogNzAwO1xuJHNlbWlCb2xkV2VpZ2h0OiA2MDA7XG4kbm9ybWFsV2VpZ2h0OiA0MDA7XG5cbiRtb2JpbGVHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcImF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnRcIlxcXG4gICAgICBcImdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLWZvb3RlclwiJyxcbik7XG4kdGFibGV0R3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyXCInLFxuKTtcbiRkZXNrdG9wR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvICN7JHNpZGVQYW5lbFdpZHRofVwiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCInLFxuKTtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuXG5Aa2V5ZnJhbWVzIGRyb3BpbiB7XG4gIDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgfVxuICAxJSB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gIH1cbn1cblxuLnBvcG92ZXIge1xuICB6LWluZGV4OiA5OTk7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIHBhZGRpbmc6IDFyZW07XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcblxuICAmID4gLnBvcG92ZXItaW5uZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB3aWR0aDogMzByZW07XG4gICAgbWF4LWhlaWdodDogMjByZW07XG4gICAgcGFkZGluZzogMCAxcmVtIDFyZW0gMXJlbTtcbiAgICBmb250LXdlaWdodDogaW5pdGlhbDtcbiAgICBmb250LXN0eWxlOiBpbml0aWFsO1xuICAgIGxpbmUtaGVpZ2h0OiBub3JtYWw7XG4gICAgZm9udC1zaXplOiBpbml0aWFsO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1ib2R5Rm9udCk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIGJveC1zaGFkb3c6IDZweCA2cHggMzZweCAwIHJnYmEoMCwgMCwgMCwgMC4yNSk7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogY29udGFpbjtcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIGN1cnNvcjogZGVmYXVsdDtcbiAgfVxuXG4gICYgPiAucG9wb3Zlci1pbm5lcltkYXRhLWNvbnRlbnQtdHlwZV0ge1xuICAgICZbZGF0YS1jb250ZW50LXR5cGUqPVwicGRmXCJdLFxuICAgICZbZGF0YS1jb250ZW50LXR5cGUqPVwiaW1hZ2VcIl0ge1xuICAgICAgcGFkZGluZzogMDtcbiAgICAgIG1heC1oZWlnaHQ6IDEwMCU7XG4gICAgfVxuXG4gICAgJltkYXRhLWNvbnRlbnQtdHlwZSo9XCJpbWFnZVwiXSB7XG4gICAgICBpbWcge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgfVxuICAgIH1cblxuICAgICZbZGF0YS1jb250ZW50LXR5cGUqPVwicGRmXCJdIHtcbiAgICAgIGlmcmFtZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGgxIHtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgfVxuXG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgb3BhY2l0eTogMDtcbiAgdHJhbnNpdGlvbjpcbiAgICBvcGFjaXR5IDAuM3MgZWFzZSxcbiAgICB2aXNpYmlsaXR5IDAuM3MgZWFzZTtcblxuICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG4uYWN0aXZlLXBvcG92ZXIsXG4ucG9wb3Zlcjpob3ZlciB7XG4gIGFuaW1hdGlvbjogZHJvcGluIDAuM3MgZWFzZTtcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogZm9yd2FyZHM7XG4gIGFuaW1hdGlvbi1kZWxheTogMC4ycztcbn1cbiJdfQ== */`;import{Features,transform}from"lightningcss";import{transform as transpile}from"esbuild";function getComponentResources(ctx){let allComponents=new Set;for(let emitter of ctx.cfg.plugins.emitters){let components=emitter.getQuartzComponents?.(ctx)??[];for(let component of components)allComponents.add(component)}let componentResources={css:new Set,beforeDOMLoaded:new Set,afterDOMLoaded:new Set};function normalizeResource(resource){return resource?Array.isArray(resource)?resource:[resource]:[]}__name(normalizeResource,"normalizeResource");for(let component of allComponents){let{css,beforeDOMLoaded,afterDOMLoaded}=component,normalizedCss=normalizeResource(css),normalizedBeforeDOMLoaded=normalizeResource(beforeDOMLoaded),normalizedAfterDOMLoaded=normalizeResource(afterDOMLoaded);normalizedCss.forEach(c=>componentResources.css.add(c)),normalizedBeforeDOMLoaded.forEach(b=>componentResources.beforeDOMLoaded.add(b)),normalizedAfterDOMLoaded.forEach(a=>componentResources.afterDOMLoaded.add(a))}return{css:[...componentResources.css],beforeDOMLoaded:[...componentResources.beforeDOMLoaded],afterDOMLoaded:[...componentResources.afterDOMLoaded]}}__name(getComponentResources,"getComponentResources");async function joinScripts(scripts){let script=scripts.map(script2=>`(function () {${script2}})();`).join(`
`);return(await transpile(script,{minify:!0})).code}__name(joinScripts,"joinScripts");function addGlobalPageResources(ctx,componentResources){let cfg=ctx.cfg.configuration;if(cfg.enablePopovers&&(componentResources.afterDOMLoaded.push(popover_inline_default),componentResources.css.push(popover_default)),cfg.analytics?.provider==="google"){let tagId=cfg.analytics.tagId;componentResources.afterDOMLoaded.push(`
      const gtagScript = document.createElement('script');
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=${tagId}';
      gtagScript.defer = true;
      gtagScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', '${tagId}', { send_page_view: false });
        gtag('event', 'page_view', { page_title: document.title, page_location: location.href });
        document.addEventListener('nav', () => {
          gtag('event', 'page_view', { page_title: document.title, page_location: location.href });
        });
      };
      
      document.head.appendChild(gtagScript);
    `)}else if(cfg.analytics?.provider==="plausible"){let plausibleHost=cfg.analytics.host??"https://plausible.io";componentResources.afterDOMLoaded.push(`
      const plausibleScript = document.createElement('script');
      plausibleScript.src = '${plausibleHost}/js/script.manual.js';
      plausibleScript.setAttribute('data-domain', location.hostname);
      plausibleScript.defer = true;
      plausibleScript.onload = () => {
        window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
        plausible('pageview');
        document.addEventListener('nav', () => {
          plausible('pageview');
        });
      };

      document.head.appendChild(plausibleScript);
    `)}else if(cfg.analytics?.provider==="umami")componentResources.afterDOMLoaded.push(`
      const umamiScript = document.createElement("script");
      umamiScript.src = "${cfg.analytics.host??"https://analytics.umami.is"}/script.js";
      umamiScript.setAttribute("data-website-id", "${cfg.analytics.websiteId}");
      umamiScript.setAttribute("data-auto-track", "true");
      umamiScript.defer = true;

      document.head.appendChild(umamiScript);
    `);else if(cfg.analytics?.provider==="goatcounter")componentResources.afterDOMLoaded.push(`
      const goatcounterScript = document.createElement('script');
      goatcounterScript.src = "${cfg.analytics.scriptSrc??"https://gc.zgo.at/count.js"}";
      goatcounterScript.defer = true;
      goatcounterScript.setAttribute(
        'data-goatcounter',
        "https://${cfg.analytics.websiteId}.${cfg.analytics.host??"goatcounter.com"}/count"
      );
      goatcounterScript.onload = () => {
        window.goatcounter = { no_onload: true };
        goatcounter.count({ path: location.pathname });
        document.addEventListener('nav', () => {
          goatcounter.count({ path: location.pathname });
        });
      };

      document.head.appendChild(goatcounterScript);
    `);else if(cfg.analytics?.provider==="posthog")componentResources.afterDOMLoaded.push(`
      const posthogScript = document.createElement("script");
      posthogScript.innerHTML= \`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('${cfg.analytics.apiKey}', {
        api_host: '${cfg.analytics.host??"https://app.posthog.com"}',
        capture_pageview: false,
      })\`
      posthogScript.onload = () => {
        posthog.capture('$pageview', { path: location.pathname });
      
        document.addEventListener('nav', () => {
          posthog.capture('$pageview', { path: location.pathname });
        });
      };

      document.head.appendChild(posthogScript);
    `);else if(cfg.analytics?.provider==="tinylytics"){let siteId=cfg.analytics.siteId;componentResources.afterDOMLoaded.push(`
      const tinylyticsScript = document.createElement('script');
      tinylyticsScript.src = 'https://tinylytics.app/embed/${siteId}.js?spa';
      tinylyticsScript.defer = true;
      tinylyticsScript.onload = () => {
        window.tinylytics.triggerUpdate();
        document.addEventListener('nav', () => {
          window.tinylytics.triggerUpdate();
        });
      };
      
      document.head.appendChild(tinylyticsScript);
    `)}else cfg.analytics?.provider==="cabin"?componentResources.afterDOMLoaded.push(`
      const cabinScript = document.createElement("script")
      cabinScript.src = "${cfg.analytics.host??"https://scripts.withcabin.com"}/hello.js"
      cabinScript.defer = true
      document.head.appendChild(cabinScript)
    `):cfg.analytics?.provider==="clarity"&&componentResources.afterDOMLoaded.push(`
      const clarityScript = document.createElement("script")
      clarityScript.innerHTML= \`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.defer=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${cfg.analytics.projectId}");\`
      document.head.appendChild(clarityScript)
    `);cfg.enableSPA?componentResources.afterDOMLoaded.push(spa_inline_default):componentResources.afterDOMLoaded.push(`
      window.spaNavigate = (url, _) => window.location.assign(url)
      window.addCleanup = () => {}
      const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
      document.dispatchEvent(event)
    `)}__name(addGlobalPageResources,"addGlobalPageResources");var ComponentResources=__name(()=>({name:"ComponentResources",async*emit(ctx,_content,_resources){let cfg=ctx.cfg.configuration,componentResources=getComponentResources(ctx),googleFontsStyleSheet="";if(cfg.theme.fontOrigin!=="local"){if(cfg.theme.fontOrigin==="googleFonts"&&!cfg.theme.cdnCaching){let theme=ctx.cfg.configuration.theme;if(googleFontsStyleSheet=await(await fetch(googleFontHref(theme))).text(),theme.typography.title){let title=ctx.cfg.configuration.pageTitle,response2=await fetch(googleFontSubsetHref(theme,title));googleFontsStyleSheet+=`
${await response2.text()}`}if(!cfg.baseUrl)throw new Error("baseUrl must be defined when using Google Fonts without cfg.theme.cdnCaching");let{processedStylesheet,fontFiles}=await processGoogleFonts(googleFontsStyleSheet,cfg.baseUrl);googleFontsStyleSheet=processedStylesheet;for(let fontFile of fontFiles){let res=await fetch(fontFile.url);if(!res.ok)throw new Error(`Failed to fetch font ${fontFile.filename}`);let buf=await res.arrayBuffer();yield write({ctx,slug:joinSegments("static","fonts",fontFile.filename),ext:`.${fontFile.extension}`,content:Buffer.from(buf)})}}}addGlobalPageResources(ctx,componentResources);let stylesheet=joinStyles(ctx.cfg.configuration.theme,googleFontsStyleSheet,...componentResources.css,custom_default),[prescript,postscript]=await Promise.all([joinScripts(componentResources.beforeDOMLoaded),joinScripts(componentResources.afterDOMLoaded)]);yield write({ctx,slug:"index",ext:".css",content:transform({filename:"index.css",code:Buffer.from(stylesheet),minify:!0,targets:{safari:984576,ios_saf:984576,edge:7536640,firefox:6684672,chrome:7143424},include:Features.MediaQueries}).code.toString()}),yield write({ctx,slug:"prescript",ext:".js",content:prescript}),yield write({ctx,slug:"postscript",ext:".js",content:postscript})},async*partialEmit(){}}),"ComponentResources");var NotFoundPage=__name(()=>{let opts={...sharedPageComponents,pageBody:__default(),beforeBody:[],left:[],right:[]},{head:Head,pageBody,footer:Footer}=opts,Body2=Body_default();return{name:"404Page",getQuartzComponents(){return[Head,Body2,pageBody,Footer]},async*emit(ctx,_content,resources){let cfg=ctx.cfg.configuration,slug="404",path12=new URL(`https://${cfg.baseUrl??"example.com"}`).pathname,notFound=i18n(cfg.locale).pages.error.title,[tree,vfile]=defaultProcessedContent({slug,text:notFound,description:notFound,frontmatter:{title:notFound,tags:[]}}),externalResources=pageResources(path12,resources),componentData={ctx,fileData:vfile.data,externalResources,cfg,children:[],tree,allFiles:[]};yield write({ctx,content:renderPage(cfg,slug,componentData,opts,externalResources),slug,ext:".html"})},async*partialEmit(){}}},"NotFoundPage");import chalk8 from"chalk";function getStaticResourcesFromPlugins(ctx){let staticResources={css:[],js:[],additionalHead:[]};for(let transformer of[...ctx.cfg.plugins.transformers,...ctx.cfg.plugins.emitters]){let res=transformer.externalResources?transformer.externalResources(ctx):{};res?.js&&staticResources.js.push(...res.js),res?.css&&staticResources.css.push(...res.css),res?.additionalHead&&staticResources.additionalHead.push(...res.additionalHead)}if(ctx.argv.serve){let wsUrl=ctx.argv.remoteDevHost?`wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`:`ws://localhost:${ctx.argv.wsPort}`;staticResources.js.push({loadTime:"afterDOMReady",contentType:"inline",script:`
        const socket = new WebSocket('${wsUrl}')
        // reload(true) ensures resources like images and scripts are fetched again in firefox
        socket.addEventListener('message', () => document.location.reload(true))
      `})}return staticResources}__name(getStaticResourcesFromPlugins,"getStaticResourcesFromPlugins");import chalk9 from"chalk";async function emitContent(ctx,content){let{argv,cfg}=ctx,perf=new PerfTimer,log=new QuartzLogger(ctx.argv.verbose);log.start("Emitting files");let emittedFiles=0,staticResources=getStaticResourcesFromPlugins(ctx);await Promise.all(cfg.plugins.emitters.map(async emitter=>{try{let emitted=await emitter.emit(ctx,content,staticResources);if(Symbol.asyncIterator in emitted)for await(let file of emitted)emittedFiles++,ctx.argv.verbose?console.log(`[emit:${emitter.name}] ${file}`):log.updateText(`${emitter.name} -> ${chalk9.gray(file)}`);else{emittedFiles+=emitted.length;for(let file of emitted)ctx.argv.verbose?console.log(`[emit:${emitter.name}] ${file}`):log.updateText(`${emitter.name} -> ${chalk9.gray(file)}`)}}catch(err){trace(`Failed to emit from plugin \`${emitter.name}\``,err)}})),log.end(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince()}`)}__name(emitContent,"emitContent");var config={configuration:{pageTitle:"Bor's Digital Garden",pageTitleSuffix:" | Code & Coffee",enableSPA:!0,enablePopovers:!0,analytics:{provider:"plausible"},locale:"en-US",baseUrl:"dominicbor.me",ignorePatterns:["private","templates",".obsidian"],defaultDateType:"modified",theme:{fontOrigin:"googleFonts",cdnCaching:!0,typography:{header:"Kalam",body:"Kalam",code:"JetBrains Mono"},colors:{lightMode:{light:"#FDF0E4",lightgray:"#F5E6D3",gray:"#8B7355",darkgray:"#4A3429",dark:"#2C1810",secondary:"#D4AF37",tertiary:"#E67E22",highlight:"rgba(212, 175, 55, 0.12)",textHighlight:"#FFF3D4"},darkMode:{light:"#1A232E",lightgray:"#243240",gray:"#7A8B99",darkgray:"#F5E6D3",dark:"#FDF0E4",secondary:"#D4AF37",tertiary:"#4A9EFF",highlight:"rgba(212, 175, 55, 0.15)",textHighlight:"#2D3748"}}}},plugins:{transformers:[FrontMatter(),CreatedModifiedDate({priority:["frontmatter","git","filesystem"]}),SyntaxHighlighting({theme:{light:"github-light",dark:"github-dark"},keepBackground:!1}),ObsidianFlavoredMarkdown({enableInHtmlEmbed:!1}),GitHubFlavoredMarkdown(),TableOfContents(),CrawlLinks({markdownLinkResolution:"shortest"}),Description(),Latex({renderEngine:"katex"})],filters:[RemoveDrafts()],emitters:[AliasRedirects(),ComponentResources(),ContentPage(),FolderPage(),TagPage(),ContentIndex({enableSiteMap:!0,enableRSS:!0}),Assets(),Static(),Favicon(),NotFoundPage()]}},quartz_config_default=config;import chokidar from"chokidar";import fs5 from"fs";import{fileURLToPath}from"url";var options={retrieveSourceMap(source){if(source.includes(".quartz-cache")){let realSource=fileURLToPath(source.split("?",2)[0]+".map");return{map:fs5.readFileSync(realSource,"utf8")}}else return null}};function randomIdNonSecure(){return Math.random().toString(36).substring(2,8)}__name(randomIdNonSecure,"randomIdNonSecure");import{minimatch}from"minimatch";sourceMapSupport.install(options);async function buildQuartz(argv,mut,clientRefresh){let ctx={buildId:randomIdNonSecure(),argv,cfg:quartz_config_default,allSlugs:[],allFiles:[],incremental:!1},perf=new PerfTimer,output=argv.output,pluginCount=Object.values(quartz_config_default.plugins).flat().length,pluginNames=__name(key=>quartz_config_default.plugins[key].map(plugin=>plugin.name),"pluginNames");argv.verbose&&(console.log(`Loaded ${pluginCount} plugins`),console.log(`  Transformers: ${pluginNames("transformers").join(", ")}`),console.log(`  Filters: ${pluginNames("filters").join(", ")}`),console.log(`  Emitters: ${pluginNames("emitters").join(", ")}`));let release=await mut.acquire();perf.addEvent("clean"),await rimraf(path11.join(output,"*"),{glob:!0}),console.log(`Cleaned output directory \`${output}\` in ${perf.timeSince("clean")}`),perf.addEvent("glob");let allFiles=await glob("**/*.*",argv.directory,quartz_config_default.configuration.ignorePatterns),markdownPaths=allFiles.filter(fp=>fp.endsWith(".md")).sort();console.log(`Found ${markdownPaths.length} input files from \`${argv.directory}\` in ${perf.timeSince("glob")}`);let filePaths=markdownPaths.map(fp=>joinSegments(argv.directory,fp));ctx.allFiles=allFiles,ctx.allSlugs=allFiles.map(fp=>slugifyFilePath(fp));let parsedFiles=await parseMarkdown(ctx,filePaths),filteredContent=filterContent(ctx,parsedFiles);if(await emitContent(ctx,filteredContent),console.log(chalk10.green(`Done processing ${markdownPaths.length} files in ${perf.timeSince()}`)),release(),argv.watch)return ctx.incremental=!0,startWatching(ctx,mut,parsedFiles,clientRefresh)}__name(buildQuartz,"buildQuartz");async function startWatching(ctx,mut,initialContent,clientRefresh){let{argv,allFiles}=ctx,contentMap=new Map;for(let filePath of allFiles)contentMap.set(filePath,{type:"other"});for(let content of initialContent){let[_tree,vfile]=content;contentMap.set(vfile.data.relativePath,{type:"markdown",content})}let gitIgnoredMatcher=await isGitIgnored(),buildData={ctx,mut,contentMap,ignored:__name(path12=>{if(gitIgnoredMatcher(path12))return!0;let pathStr=path12.toString();for(let pattern of quartz_config_default.configuration.ignorePatterns)if(minimatch(pathStr,pattern))return!0;return!1},"ignored"),changesSinceLastBuild:{},lastBuildMs:0},watcher=chokidar.watch(".",{persistent:!0,cwd:argv.directory,ignoreInitial:!0}),changes=[];return watcher.on("add",fp=>{buildData.ignored(fp)||(changes.push({path:fp,type:"add"}),rebuild(changes,clientRefresh,buildData))}).on("change",fp=>{buildData.ignored(fp)||(changes.push({path:fp,type:"change"}),rebuild(changes,clientRefresh,buildData))}).on("unlink",fp=>{buildData.ignored(fp)||(changes.push({path:fp,type:"delete"}),rebuild(changes,clientRefresh,buildData))}),async()=>{await watcher.close()}}__name(startWatching,"startWatching");async function rebuild(changes,clientRefresh,buildData){let{ctx,contentMap,mut,changesSinceLastBuild}=buildData,{argv,cfg}=ctx,buildId=randomIdNonSecure();ctx.buildId=buildId,buildData.lastBuildMs=new Date().getTime();let numChangesInBuild=changes.length,release=await mut.acquire();if(ctx.buildId!==buildId){release();return}let perf=new PerfTimer;perf.addEvent("rebuild"),console.log(chalk10.yellow("Detected change, rebuilding..."));for(let change of changes)changesSinceLastBuild[change.path]=change.type;let staticResources=getStaticResourcesFromPlugins(ctx),pathsToParse=[];for(let[fp,type]of Object.entries(changesSinceLastBuild)){if(type==="delete"||path11.extname(fp)!==".md")continue;let fullPath=joinSegments(argv.directory,toPosixPath(fp));pathsToParse.push(fullPath)}let parsed=await parseMarkdown(ctx,pathsToParse);for(let content of parsed)contentMap.set(content[1].data.relativePath,{type:"markdown",content});for(let[file,change]of Object.entries(changesSinceLastBuild))change==="delete"&&contentMap.delete(file),change==="add"&&path11.extname(file)!==".md"&&contentMap.set(file,{type:"other"});let changeEvents=Object.entries(changesSinceLastBuild).map(([fp,type])=>{let path12=fp,processedContent=contentMap.get(path12);if(processedContent?.type==="markdown"){let[_tree,file]=processedContent.content;return{type,path:path12,file}}return{type,path:path12}});ctx.allFiles=Array.from(contentMap.keys()),ctx.allSlugs=ctx.allFiles.map(fp=>slugifyFilePath(fp));let processedFiles=Array.from(contentMap.values()).filter(file=>file.type==="markdown").map(file=>file.content),emittedFiles=0;for(let emitter of cfg.plugins.emitters){let emitted=await(emitter.partialEmit??emitter.emit)(ctx,processedFiles,staticResources,changeEvents);if(emitted!==null){if(Symbol.asyncIterator in emitted)for await(let file of emitted)emittedFiles++,ctx.argv.verbose&&console.log(`[emit:${emitter.name}] ${file}`);else if(emittedFiles+=emitted.length,ctx.argv.verbose)for(let file of emitted)console.log(`[emit:${emitter.name}] ${file}`)}}console.log(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince("rebuild")}`),console.log(chalk10.green(`Done rebuilding in ${perf.timeSince()}`)),changes.splice(0,numChangesInBuild),clientRefresh(),release()}__name(rebuild,"rebuild");var build_default=__name(async(argv,mut,clientRefresh)=>{try{return await buildQuartz(argv,mut,clientRefresh)}catch(err){trace(`
Exiting Quartz due to a fatal error`,err)}},"default");export{build_default as default};
//# sourceMappingURL=transpiled-build.mjs.map
