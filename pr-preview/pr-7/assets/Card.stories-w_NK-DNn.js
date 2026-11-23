import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./Button-3Q8C0YTu.js";import{i,n as a,r as o,t as s}from"./dist-Be47NwFh.js";import{n as c,t as l}from"./Heading-CAlw7Cts.js";var u;function d(){return(d=e((()=>{a(),u=s(`flex flex-col gap-6 rounded-xl border border-border bg-card py-6 text-card-foreground shadow-sm`)})))()}function f({className:e,...t}){return(0,v.jsx)(`div`,{"data-slot":`card`,className:o(u(),e),...t})}function p({className:e,...t}){return(0,v.jsx)(`div`,{"data-slot":`card-header`,className:o(`grid gap-1.5 px-6`,e),...t})}function m({level:e=3,...t}){return(0,v.jsx)(l,{"data-slot":`card-title`,level:e,...t})}function h({className:e,...t}){return(0,v.jsx)(`p`,{"data-slot":`card-description`,className:o(`text-small text-muted-foreground`,e),...t})}function g({className:e,...t}){return(0,v.jsx)(`div`,{"data-slot":`card-content`,className:o(`px-6`,e),...t})}function _({className:e,...t}){return(0,v.jsx)(`div`,{"data-slot":`card-footer`,className:o(`flex items-center gap-3 px-6`,e),...t})}var v;function y(){return(y=e((()=>{c(),i(),d(),v=t(),f.__docgenInfo={description:``,methods:[],displayName:`Card`},p.__docgenInfo={description:``,methods:[],displayName:`CardHeader`},m.__docgenInfo={description:``,methods:[],displayName:`CardTitle`,props:{level:{required:!1,tsType:{name:`union`,raw:`1 | 2 | 3 | 4 | 5 | 6`,elements:[{name:`literal`,value:`1`},{name:`literal`,value:`2`},{name:`literal`,value:`3`},{name:`literal`,value:`4`},{name:`literal`,value:`5`},{name:`literal`,value:`6`}]},description:"Document outline level (`h1`–`h6`); the look comes from `size`.",defaultValue:{value:`3`,computed:!1}}}},h.__docgenInfo={description:``,methods:[],displayName:`CardDescription`},g.__docgenInfo={description:``,methods:[],displayName:`CardContent`},_.__docgenInfo={description:``,methods:[],displayName:`CardFooter`}})))()}var b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{n(),y(),b=t(),x=(0,b.jsxs)(p,{children:[(0,b.jsx)(m,{level:2,children:`Entrar`}),(0,b.jsx)(h,{children:`Use sua conta Google para acessar o painel da sua loja.`})]}),S=(0,b.jsx)(g,{children:(0,b.jsx)(`p`,{className:`text-small`,children:`Ao continuar, você aceita os termos de uso da Purpler.`})}),C=(0,b.jsx)(_,{children:(0,b.jsx)(r,{className:`w-full`,children:`Continuar com Google`})}),w={title:`Molecules/Card`,component:f,tags:[`autodocs`],args:{className:`max-w-sm`,children:(0,b.jsxs)(b.Fragment,{children:[x,S,C]})},argTypes:{children:{control:!1,description:"`CardHeader` (com `CardTitle` e `CardDescription`), `CardContent` e `CardFooter`; `CardTitle` aceita `level` de 1 a 6"},className:{control:`text`}}},T={},E={args:{children:x}},D={args:{children:(0,b.jsxs)(b.Fragment,{children:[x,S]})}},O={parameters:{controls:{disable:!0}},render:()=>(0,b.jsxs)(`div`,{className:`grid gap-4 md:grid-cols-3`,children:[(0,b.jsxs)(f,{children:[x,S,C]}),(0,b.jsxs)(f,{children:[x,S]}),(0,b.jsxs)(f,{children:[(0,b.jsx)(p,{children:(0,b.jsx)(m,{level:2,children:`Pedidos de hoje`})}),(0,b.jsx)(g,{children:(0,b.jsx)(`p`,{className:`text-small`,children:`Nenhum pedido novo por enquanto.`})})]})]})},k=[`Default`,`HeaderOnly`,`WithoutFooter`,`AllVariants`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    children: header
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        {header}
        {content}
      </>
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="grid gap-4 md:grid-cols-3">
      <Card>
        {header}
        {content}
        {footer}
      </Card>
      <Card>
        {header}
        {content}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle level={2}>Pedidos de hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-small">Nenhum pedido novo por enquanto.</p>
        </CardContent>
      </Card>
    </div>
}`,...O.parameters?.docs?.source}}}})))()}A();export{O as AllVariants,T as Default,E as HeaderOnly,D as WithoutFooter,k as __namedExportsOrder,w as default};