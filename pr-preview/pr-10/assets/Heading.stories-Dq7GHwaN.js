import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./Heading-CAlw7Cts.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),a=[`display`,`title-1`,`title-2`,`title-3`],o=[1,2,3,4,5,6],s={title:`Atoms/Heading`,component:r,tags:[`autodocs`],args:{children:`Venda com a sua marca`,level:2},argTypes:{level:{control:`select`,options:o,description:"Nível no sumário da página (`h1`–`h6`); mantenha a ordem sem pular níveis"},size:{control:`select`,options:a,description:`Tamanho visual, independente do nível; sem valor, segue o nível`},children:{control:`text`}}},c={},l={args:{level:1,children:`Entrar na Purpler`}},u={args:{level:1,size:`display`,children:`Sua loja no ar hoje`}},d={args:{level:1,size:`title-3`,children:`Meus pedidos`}},f={parameters:{controls:{disable:!0}},render:()=>(0,i.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[a.map(e=>(0,i.jsx)(r,{level:2,size:e,children:`Tamanho ${e}`},e)),o.map(e=>(0,i.jsx)(r,{level:e,children:`Nível ${String(e)} com o tamanho padrão`},e))]})},p=[`Default`,`PageTitle`,`Display`,`SmallSizeHighLevel`,`AllVariants`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    level: 1,
    children: 'Entrar na Purpler'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    level: 1,
    size: 'display',
    children: 'Sua loja no ar hoje'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    level: 1,
    size: 'title-3',
    children: 'Meus pedidos'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-6">
      {SIZES.map(size => <Heading key={size} level={2} size={size}>
          {\`Tamanho \${size}\`}
        </Heading>)}
      {LEVELS.map(level => <Heading key={level} level={level}>
          {\`Nível \${String(level)} com o tamanho padrão\`}
        </Heading>)}
    </div>
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as AllVariants,c as Default,u as Display,l as PageTitle,d as SmallSizeHighLevel,p as __namedExportsOrder,s as default};