import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DvvP-0SR.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{f as r,p as i}from"./iframe-7dJfhiEs.js";import{a,i as o,o as s,r as c,s as l,t as u}from"./ImageUploader-BXKQpJnO.js";import{n as d,t as f}from"./trash-DDOrqv-_.js";import{i as p,n as m,r as h,t as g}from"./dist-Be47NwFh.js";import{i as _,n as v,r as y,t as b}from"./files-Enyi2OIs.js";import{n as x,t as S}from"./Button-Baz-k9Ie.js";var C,w,T;function E(){return(E=e((()=>{m(),C=g(`flex w-full flex-col gap-4 font-sans text-foreground`),w=g([`flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground`,`group-data-[dragging=true]:border-primary`]),T=g(`h-32 w-full rounded-md bg-muted object-contain p-2`)})))()}function D({className:e,image:t,onFileSelected:n,onRemove:r,onRetry:i,accept:a,maxSize:c,...l}){let d=(0,O.useId)(),p=(0,O.useRef)(null),m=(0,O.useRef)(null),g=(0,O.useRef)(!1),[y,x]=(0,O.useState)(!1),[E,D]=(0,O.useState)(``),[A,j]=(0,O.useState)(``),M=v(a),N=b(c);(0,O.useEffect)(()=>{g.current&&(g.current=!1,m.current?.focus())},[t]);function P(e){let[r]=e;if(r===void 0)return;let i=``;e.length>1?i=`Envie só uma imagem.`:_(r,a)?r.size>c&&(i=`${r.name}: maior que ${N}.`):i=`${r.name}: tipo não aceito. Envie ${M}.`,D(i),i||(j(t===void 0?`1 imagem adicionada.`:`Imagem trocada.`),n(r))}function F(){g.current=!0,j(`Imagem removida.`),r()}function I(e){P([...e.target.files??[]]),e.target.value=``}function L(e){e.dataTransfer.types.includes(`Files`)&&(e.preventDefault(),x(!0))}function R(e){let t=e.relatedTarget;t instanceof Node&&e.currentTarget.contains(t)||x(!1)}function z(e){e.dataTransfer.types.includes(`Files`)&&(e.preventDefault(),x(!1),P([...e.dataTransfer.files]))}let B=()=>p.current?.click();return(0,k.jsxs)(`div`,{role:`group`,"data-slot":`single-image-uploader`,"data-dragging":y,className:h(`group`,C(),e),onDragOver:L,onDragLeave:R,onDrop:z,...l,children:[t===void 0?(0,k.jsxs)(`button`,{ref:m,type:`button`,"data-slot":`single-image-uploader-dropzone`,"aria-describedby":d,className:o(),onClick:B,children:[(0,k.jsx)(s,{"aria-hidden":`true`,className:`size-8 text-muted-foreground`}),(0,k.jsx)(`span`,{className:`text-body font-semibold`,children:`Adicionar imagem`}),` `,(0,k.jsx)(`span`,{className:`text-small text-muted-foreground`,children:`Arraste para cá ou clique para escolher`})]}):(0,k.jsxs)(`div`,{"data-slot":`single-image-uploader-preview`,className:w(),children:[(0,k.jsx)(`img`,{src:t.src,alt:t.alt||`Imagem atual`,className:T()}),(0,k.jsx)(u,{image:t,name:`imagem`,onRetry:()=>{i()}}),(0,k.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,k.jsxs)(S,{variant:`outline`,"aria-describedby":d,onClick:B,children:[(0,k.jsx)(s,{"aria-hidden":`true`}),`Trocar`]}),(0,k.jsxs)(S,{variant:`ghost`,onClick:F,children:[(0,k.jsx)(f,{"aria-hidden":`true`}),`Remover`]})]})]}),(0,k.jsx)(`p`,{id:d,className:`-mt-2 text-small text-muted-foreground`,children:`${M}, até ${N}.`}),(0,k.jsx)(`input`,{ref:p,"data-slot":`single-image-uploader-input`,type:`file`,accept:a,hidden:!0,tabIndex:-1,onChange:I}),E&&(0,k.jsx)(`p`,{role:`alert`,className:`text-small font-semibold text-destructive`,children:E}),(0,k.jsx)(`p`,{"aria-live":`polite`,className:`sr-only`,children:A})]})}var O,k;function A(){return(A=e((()=>{l(),d(),O=t(),x(),p(),y(),c(),a(),E(),k=n(),D.__docgenInfo={description:`One image (a logo, a favicon) with replace, remove, progress and retry; the app does the upload.`,methods:[],displayName:`SingleImageUploader`,props:{image:{required:!1,tsType:{name:`union`,raw:`ImageUploaderImage | undefined`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  src: string;
  alt?: string | undefined;
  status: ImageUploaderStatus;
  /** Upload progress from 0 to 100; without it the bar is indeterminate. */
  progress?: number | undefined;
  error?: string | undefined;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`src`,value:{name:`string`,required:!0}},{key:`alt`,value:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}],required:!1}},{key:`status`,value:{name:`union`,raw:`'uploading' | 'processing' | 'ready' | 'error'`,elements:[{name:`literal`,value:`'uploading'`},{name:`literal`,value:`'processing'`},{name:`literal`,value:`'ready'`},{name:`literal`,value:`'error'`}],required:!0}},{key:`progress`,value:{name:`union`,raw:`number | undefined`,elements:[{name:`number`},{name:`undefined`}],required:!1},description:`Upload progress from 0 to 100; without it the bar is indeterminate.`},{key:`error`,value:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}],required:!1}}]}},{name:`undefined`}]},description:`The current image; without it the drop zone shows.`},onFileSelected:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(file: File) => void`,signature:{arguments:[{type:{name:`File`},name:`file`}],return:{name:`void`}}},description:"One file that passed `accept` and `maxSize`; with an image present it replaces it."},onRemove:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},accept:{required:!0,tsType:{name:`string`},description:"Same syntax as the input: `image/png,image/webp`, `image/*` or `.jpg`."},maxSize:{required:!0,tsType:{name:`number`},description:`Largest file in bytes.`}}}})))()}function j(e){let[t,n]=(0,M.useState)(void 0),r=(0,M.useRef)([]);return(0,M.useEffect)(()=>{let e=setInterval(()=>{n(e=>{if(e?.status===`processing`)return{...e,status:`ready`};if(e?.status!==`uploading`)return e;let t=(e.progress??0)+20;return t<100?{...e,progress:t}:e.file?.name.includes(`erro`)?{...e,status:`error`,error:`Não conseguimos enviar. Tente de novo.`}:{...e,status:`processing`}})},300),t=r.current;return()=>{clearInterval(e),t.forEach(e=>{URL.revokeObjectURL(e)})}},[]),(0,N.jsx)(D,{...e,image:t,onFileSelected:t=>{e.onFileSelected(t);let i=URL.createObjectURL(t);r.current.push(i),n({id:i,src:i,file:t,status:`uploading`,progress:0})},onRemove:()=>{e.onRemove(),n(void 0)},onRetry:()=>{e.onRetry(),n(e=>e&&{...e,status:`uploading`,progress:0,file:void 0})}})}var M,N,P,F,I,L,R,z,B,V,H,U,W,G;function K(){return(K=e((()=>{r(),M=t(),A(),N=n(),{fn:P}=__STORYBOOK_MODULE_TEST__,F=1048576,I=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><circle cx="20" cy="20" r="16" fill="${i.brand[600].hex}"/><rect x="44" y="12" width="68" height="16" rx="8" fill="${i.accent[500].hex}"/></svg>`,L={id:`logo`,src:`data:image/svg+xml,${encodeURIComponent(I)}`,alt:`Logo da Doces da Ana`,status:`ready`},R={title:`Organisms/SingleImageUploader`,component:D,tags:[`autodocs`],args:{"aria-label":`Logo da loja`,image:L,accept:`image/jpeg,image/png,image/webp`,maxSize:2*F,onFileSelected:P(),onRemove:P(),onRetry:P()},argTypes:{image:{control:`object`,description:`A imagem atual; sem ela, aparece a área de envio`},accept:{control:`text`,description:"Tipos aceitos, na sintaxe do `<input accept>`"},maxSize:{control:`number`,description:`Tamanho máximo do arquivo, em bytes`},onFileSelected:{description:`Recebe o arquivo que passou nas regras; com imagem, é a troca`},onRemove:{description:`Remove a imagem atual`},onRetry:{description:`Tenta de novo o envio que falhou`}},decorators:[e=>(0,N.jsx)(`div`,{className:`max-w-sm`,children:(0,N.jsx)(e,{})})]},z={},B={args:{image:void 0}},V={args:{image:{...L,status:`uploading`,progress:60}}},H={args:{image:{...L,status:`error`,error:`A conexão caiu durante o envio.`}}},U={args:{image:void 0},render:e=>(0,N.jsx)(j,{...e})},W={parameters:{controls:{disable:!0}},render:e=>(0,N.jsxs)(`div`,{className:`grid gap-8`,children:[(0,N.jsx)(D,{...e,"aria-label":`Sem logo`,image:void 0}),(0,N.jsx)(D,{...e,"aria-label":`Logo pronto`,image:L}),(0,N.jsx)(D,{...e,"aria-label":`Logo enviando`,image:{...L,status:`uploading`,progress:45}}),(0,N.jsx)(D,{...e,"aria-label":`Logo processando`,image:{...L,status:`processing`}}),(0,N.jsx)(D,{...e,"aria-label":`Logo com erro`,image:{...L,status:`error`,error:`A conexão caiu durante o envio.`}})]})},G=[`Default`,`Empty`,`Uploading`,`WithError`,`SimulatedUpload`,`AllVariants`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    image: undefined
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    image: {
      ...READY,
      status: 'uploading',
      progress: 60
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    image: {
      ...READY,
      status: 'error',
      error: 'A conexão caiu durante o envio.'
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    image: undefined
  },
  render: args => <SimulatedUploader {...args} />
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: args => <div className="grid gap-8">
      <SingleImageUploader {...args} aria-label="Sem logo" image={undefined} />
      <SingleImageUploader {...args} aria-label="Logo pronto" image={READY} />
      <SingleImageUploader {...args} aria-label="Logo enviando" image={{
      ...READY,
      status: 'uploading',
      progress: 45
    }} />
      <SingleImageUploader {...args} aria-label="Logo processando" image={{
      ...READY,
      status: 'processing'
    }} />
      <SingleImageUploader {...args} aria-label="Logo com erro" image={{
      ...READY,
      status: 'error',
      error: 'A conexão caiu durante o envio.'
    }} />
    </div>
}`,...W.parameters?.docs?.source}}}})))()}K();export{W as AllVariants,z as Default,B as Empty,U as SimulatedUpload,V as Uploading,H as WithError,G as __namedExportsOrder,R as default};