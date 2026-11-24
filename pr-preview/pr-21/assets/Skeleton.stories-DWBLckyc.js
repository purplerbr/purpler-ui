import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{i as n,n as r,r as i,t as a}from"./dist-Be47NwFh.js";import{n as o,t as s}from"./Text-u5d8PBf7.js";var c;function l(){return(l=e((()=>{r(),c=a(`animate-pulse rounded-md bg-skeleton motion-reduce:animate-none`)})))()}function u({className:e,...t}){return(0,d.jsx)(`div`,{"data-slot":`skeleton`,className:i(c(),e),...t,"aria-hidden":`true`})}var d;function f(){return(f=e((()=>{n(),l(),d=t(),u.__docgenInfo={description:'Placeholder block; the container that holds it announces the loading (`role="status"`).',methods:[],displayName:`Skeleton`}})))()}var p,m,h,g,_,v;function y(){return(y=e((()=>{o(),f(),p=t(),m={title:`Atoms/Skeleton`,component:u,tags:[`autodocs`],args:{className:`h-4 w-48`},argTypes:{className:{control:`text`,description:"Só tamanho e forma (`h-*`, `w-*`, `rounded-full`). O bloco tem `aria-hidden`: quem o envolve anuncia o carregamento"}},parameters:{docs:{description:{component:'O `Skeleton` é decorativo e fica fora do leitor de tela. Envolva os blocos num contêiner com `aria-busy="true"` e um texto em `role="status"` (pode ser `sr-only`) que diga o que está carregando.'}}}},h={},g={args:{className:`size-10 rounded-full`}},_={parameters:{controls:{disable:!0}},render:()=>(0,p.jsxs)(`div`,{"aria-busy":`true`,className:`flex max-w-sm flex-col gap-4`,children:[(0,p.jsx)(s,{as:`span`,role:`status`,className:`sr-only`,children:`Carregando pedidos…`}),[1,2,3].map(e=>(0,p.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,p.jsx)(u,{className:`size-10 rounded-full`}),(0,p.jsxs)(`div`,{className:`flex flex-1 flex-col gap-2`,children:[(0,p.jsx)(u,{className:`h-4 w-3/4`}),(0,p.jsx)(u,{className:`h-4 w-1/2`})]})]},e)),(0,p.jsx)(u,{className:`h-32 w-full rounded-xl`})]})},v=[`Default`,`Circle`,`AllVariants`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'size-10 rounded-full'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div aria-busy="true" className="flex max-w-sm flex-col gap-4">
      <Text as="span" role="status" className="sr-only">
        Carregando pedidos…
      </Text>
      {[1, 2, 3].map(row => <div key={row} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>)}
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
}`,..._.parameters?.docs?.source}}}})))()}y();export{_ as AllVariants,g as Circle,h as Default,v as __namedExportsOrder,m as default};