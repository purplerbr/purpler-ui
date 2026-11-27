import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./Text-u5d8PBf7.js";import{n as i,t as a}from"./Skeleton-nU6p-Z0h.js";var o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i(),o=t(),s={title:`Atoms/Skeleton`,component:a,tags:[`autodocs`],args:{className:`h-4 w-48`},argTypes:{className:{control:`text`,description:"Só tamanho e forma (`h-*`, `w-*`, `rounded-full`). O bloco tem `aria-hidden`: quem o envolve anuncia o carregamento"}},parameters:{docs:{description:{component:'O `Skeleton` é decorativo e fica fora do leitor de tela. Envolva os blocos num contêiner com `aria-busy="true"` e um texto em `role="status"` (pode ser `sr-only`) que diga o que está carregando.'}}}},c={},l={args:{className:`size-10 rounded-full`}},u={parameters:{controls:{disable:!0}},render:()=>(0,o.jsxs)(`div`,{"aria-busy":`true`,className:`flex max-w-sm flex-col gap-4`,children:[(0,o.jsx)(r,{as:`span`,role:`status`,className:`sr-only`,children:`Carregando pedidos…`}),[1,2,3].map(e=>(0,o.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,o.jsx)(a,{className:`size-10 rounded-full`}),(0,o.jsxs)(`div`,{className:`flex flex-1 flex-col gap-2`,children:[(0,o.jsx)(a,{className:`h-4 w-3/4`}),(0,o.jsx)(a,{className:`h-4 w-1/2`})]})]},e)),(0,o.jsx)(a,{className:`h-32 w-full rounded-xl`})]})},d=[`Default`,`Circle`,`AllVariants`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    className: 'size-10 rounded-full'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as AllVariants,l as Circle,c as Default,d as __namedExportsOrder,s as default};