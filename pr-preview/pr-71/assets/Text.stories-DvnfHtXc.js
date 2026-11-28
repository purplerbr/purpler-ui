import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./Text-u5d8PBf7.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),a=[`body-lg`,`body`,`small`,`caption`],o=[`inherit`,`default`,`muted`,`primary`,`destructive`],s={title:`Atoms/Text`,component:r,tags:[`autodocs`],args:{children:`Monte sua loja e venda com a sua marca.`},argTypes:{as:{control:`select`,options:[`p`,`span`,`div`],description:"Elemento: `p` para parágrafo, `span` dentro de uma linha, `div` em volta de blocos"},size:{control:`select`,options:a,description:`Estilo de texto da escala da marca`},tone:{control:`select`,options:o,description:"Cor semântica; `inherit` usa a cor de quem envolve o texto"},children:{control:`text`}}},c={},l={args:{size:`small`,tone:`muted`,children:`Ao continuar, você aceita os termos de uso.`}},u={args:{as:`span`,size:`caption`,children:`Novidade`}},d={args:{tone:`destructive`,children:`Não foi possível entrar. Tente de novo.`}},f={parameters:{controls:{disable:!0}},render:()=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[a.map(e=>(0,i.jsx)(r,{size:e,children:`Tamanho ${e}: seu pedido saiu para entrega.`},e)),o.map(e=>(0,i.jsx)(r,{tone:e,children:`Tom ${e}: seu pedido saiu para entrega.`},e))]})},p=[`Default`,`Muted`,`Caption`,`Destructive`,`AllVariants`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'small',
    tone: 'muted',
    children: 'Ao continuar, você aceita os termos de uso.'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    as: 'span',
    size: 'caption',
    children: 'Novidade'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'destructive',
    children: 'Não foi possível entrar. Tente de novo.'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-6">
      {SIZES.map(size => <Text key={size} size={size}>
          {\`Tamanho \${size}: seu pedido saiu para entrega.\`}
        </Text>)}
      {TONES.map(tone => <Text key={tone} tone={tone}>
          {\`Tom \${tone}: seu pedido saiu para entrega.\`}
        </Text>)}
    </div>
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as AllVariants,u as Caption,c as Default,d as Destructive,l as Muted,p as __namedExportsOrder,s as default};