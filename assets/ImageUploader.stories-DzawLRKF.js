import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DvvP-0SR.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{f as r,p as i}from"./iframe-7dJfhiEs.js";import{n as a,r as o}from"./ImageUploader-BXKQpJnO.js";function s(e,t){let n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${e}"/><stop offset="1" stop-color="${t}"/></linearGradient></defs><rect width="4" height="4" fill="url(#g)"/></svg>`;return`data:image/svg+xml,${encodeURIComponent(n)}`}function c(e){let[t,n]=(0,l.useState)([]),r=(0,l.useRef)([]);return(0,l.useEffect)(()=>{let e=setInterval(()=>{n(e=>e.map(e=>{if(e.status===`processing`)return{...e,status:`ready`};if(e.status!==`uploading`)return e;let t=(e.progress??0)+20;return t<100?{...e,progress:t}:e.file?.name.includes(`erro`)?{...e,status:`error`,error:`Não conseguimos enviar. Tente de novo.`}:{...e,status:`processing`}}))},300),t=r.current;return()=>{clearInterval(e),t.forEach(e=>{URL.revokeObjectURL(e)})}},[]),(0,u.jsx)(a,{...e,images:t,onFilesSelected:t=>{e.onFilesSelected(t);let i=t.map(e=>{let t=URL.createObjectURL(e);return r.current.push(t),{id:t,src:t,file:e,status:`uploading`,progress:0}});n(e=>[...e,...i])},onRemove:t=>{e.onRemove(t),n(e=>e.filter(e=>e.id!==t))},onRetry:t=>{e.onRetry(t),n(e=>e.map(e=>e.id===t?{...e,status:`uploading`,progress:0,file:void 0}:e))},onReorder:t=>{e.onReorder(t),n(e=>t.flatMap(t=>e.filter(e=>e.id===t)))}})}var l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{r(),l=t(),o(),u=n(),{fn:d}=__STORYBOOK_MODULE_TEST__,f=1048576,p=[s(i.brand[300].hex,i.brand[700].hex),s(i.accent[200].hex,i.accent[600].hex),s(i.success[200].hex,i.success[700].hex),s(i.info[200].hex,i.info[700].hex),s(i.neutral[200].hex,i.neutral[600].hex)],m=e=>p[e%p.length]??``,h=[{id:`a`,src:m(0),alt:`Bolo de cenoura com cobertura`,status:`ready`},{id:`b`,src:m(1),status:`uploading`,progress:45},{id:`c`,src:m(2),status:`processing`},{id:`d`,src:m(3),status:`error`,error:`A conexão caiu durante o envio.`},{id:`e`,src:m(4),status:`uploading`}],g={title:`Organisms/ImageUploader`,component:a,tags:[`autodocs`],args:{"aria-label":`Imagens do produto`,images:h,accept:`image/jpeg,image/png,image/webp`,maxSize:5*f,maxFiles:10,onFilesSelected:d(),onRemove:d(),onRetry:d(),onReorder:d()},argTypes:{images:{control:`object`,description:`Imagens na ordem de exibição; a primeira é a capa`},accept:{control:`text`,description:"Tipos aceitos, na sintaxe do `<input accept>`"},maxSize:{control:`number`,description:`Tamanho máximo de cada arquivo, em bytes`},maxFiles:{control:`number`,description:`Quantidade máxima de imagens`},onFilesSelected:{description:`Recebe só os arquivos que passaram nas regras`},onRemove:{description:"Recebe o `id` da imagem"},onRetry:{description:"Recebe o `id` da imagem com erro"},onReorder:{description:"Recebe todos os `id`s na nova ordem"}}},_={},v={args:{images:[]}},y={args:{images:h.slice(0,1),maxFiles:1}},b={args:{images:[],maxFiles:6},render:e=>(0,u.jsx)(c,{...e})},x={parameters:{controls:{disable:!0}},render:e=>(0,u.jsxs)(`div`,{className:`grid gap-8`,children:[(0,u.jsx)(a,{...e,"aria-label":`Sem imagens`,images:[]}),(0,u.jsx)(a,{...e,"aria-label":`Todos os estados`,images:h}),(0,u.jsx)(a,{...e,"aria-label":`Limite atingido`,images:h.slice(0,2),maxFiles:2})]})},S=[`Default`,`Empty`,`Full`,`SimulatedUpload`,`AllVariants`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    images: []
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    images: ALL_STATUSES.slice(0, 1),
    maxFiles: 1
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    images: [],
    maxFiles: 6
  },
  render: args => <SimulatedUploader {...args} />
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: args => <div className="grid gap-8">
      <ImageUploader {...args} aria-label="Sem imagens" images={[]} />
      <ImageUploader {...args} aria-label="Todos os estados" images={ALL_STATUSES} />
      <ImageUploader {...args} aria-label="Limite atingido" images={ALL_STATUSES.slice(0, 2)} maxFiles={2} />
    </div>
}`,...x.parameters?.docs?.source}}}})))()}C();export{x as AllVariants,_ as Default,v as Empty,y as Full,b as SimulatedUpload,S as __namedExportsOrder,g as default};