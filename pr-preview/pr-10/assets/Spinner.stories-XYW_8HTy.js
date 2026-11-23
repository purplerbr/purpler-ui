import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./loader-circle-DD4MahW4.js";import{i,n as a,r as o,t as s}from"./dist-Be47NwFh.js";var c;function l(){return(l=e((()=>{a(),c=s(`shrink-0 animate-spin text-primary motion-reduce:animate-none`,{variants:{size:{sm:`size-4`,md:`size-6`,lg:`size-10`}},defaultVariants:{size:`md`}})})))()}function u({className:e,size:t,label:n=`Carregando…`,showLabel:i=!1,...a}){return(0,d.jsxs)(`span`,{"data-slot":`spinner`,role:`status`,className:o(`inline-flex items-center gap-2 font-sans text-small`,e),...a,children:[(0,d.jsx)(r,{"aria-hidden":`true`,className:c({size:t})}),(0,d.jsx)(`span`,{"data-slot":`spinner-label`,className:i?void 0:`sr-only motion-reduce:not-sr-only`,children:n})]})}var d;function f(){return(f=e((()=>{n(),i(),l(),d=t(),u.__docgenInfo={description:``,methods:[],displayName:`Spinner`,props:{label:{required:!1,tsType:{name:`string`},description:"Text announced by screen readers; also shown when `showLabel` is on.",defaultValue:{value:`'Carregando…'`,computed:!1}},showLabel:{required:!1,tsType:{name:`boolean`},description:`Shows the label next to the ring; it always shows when the user asks for reduced motion.`,defaultValue:{value:`false`,computed:!1}}}}})))()}var p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{f(),p=t(),m=[`sm`,`md`,`lg`],h={title:`Atoms/Spinner`,component:u,tags:[`autodocs`],args:{label:`Carregando…`,showLabel:!1},argTypes:{size:{control:`select`,options:m,description:`Tamanho do anel`},label:{control:`text`,description:'Texto do `role="status"`; diga o que está carregando quando der'},showLabel:{control:`boolean`,description:`Mostra o texto ao lado do anel. Com movimento reduzido, o anel para e o texto aparece sempre`}}},g={},_={args:{showLabel:!0,label:`Carregando pedidos…`}},v={args:{size:`sm`}},y={args:{size:`lg`}},b={parameters:{controls:{disable:!0},docs:{description:{story:'Use como `fallback` do `<Suspense>` das rotas: `<div className="grid min-h-dvh place-items-center"><Spinner size="lg" showLabel label="Carregando o painel…" /></div>`. O app só posiciona; o visual vem da lib.'}}},render:()=>(0,p.jsx)(`div`,{className:`grid min-h-dvh place-items-center`,children:(0,p.jsx)(u,{size:`lg`,showLabel:!0,label:`Carregando o painel…`})})},x={parameters:{controls:{disable:!0}},render:()=>(0,p.jsx)(`div`,{className:`flex flex-col gap-6`,children:m.map(e=>(0,p.jsxs)(`div`,{className:`flex flex-wrap items-center gap-8`,children:[(0,p.jsx)(u,{size:e,label:`Carregando (${e})…`}),(0,p.jsx)(u,{size:e,showLabel:!0,label:`Carregando (${e})…`})]},e))})},S=[`Default`,`WithLabel`,`Small`,`Large`,`PageLoading`,`AllVariants`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    showLabel: true,
    label: 'Carregando pedidos…'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      description: {
        story: 'Use como \`fallback\` do \`<Suspense>\` das rotas: \`<div className="grid min-h-dvh place-items-center"><Spinner size="lg" showLabel label="Carregando o painel…" /></div>\`. O app só posiciona; o visual vem da lib.'
      }
    }
  },
  render: () => <div className="grid min-h-dvh place-items-center">
      <Spinner size="lg" showLabel label="Carregando o painel…" />
    </div>
}`,...b.parameters?.docs?.source},description:{story:"Route fallback for `<Suspense>`: a centered spinner with a visible label, nothing else.",...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-6">
      {SIZES.map(size => <div key={size} className="flex flex-wrap items-center gap-8">
          <Spinner size={size} label={\`Carregando (\${size})…\`} />
          <Spinner size={size} showLabel label={\`Carregando (\${size})…\`} />
        </div>)}
    </div>
}`,...x.parameters?.docs?.source}}}})))()}C();export{x as AllVariants,g as Default,y as Large,b as PageLoading,v as Small,_ as WithLabel,S as __namedExportsOrder,h as default};