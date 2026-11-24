import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./Text-u5d8PBf7.js";import{n as i,t as a}from"./Heading-Bc7OvTrG.js";import{n as o,t as s}from"./MarketingHeader-B63WZWy8.js";function c(e){return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(s,{...e}),(0,l.jsxs)(`main`,{id:`conteudo`,tabIndex:-1,className:`mx-auto grid max-w-6xl gap-4 px-4 py-12 outline-none md:px-6`,children:[(0,l.jsx)(a,{level:1,size:`display`,children:`Sua loja online com a sua marca`}),(0,l.jsx)(r,{size:`body-lg`,tone:`muted`,children:`Venda produtos físicos, digitais e cursos com o seu domínio e as suas contas de pagamento.`})]})]})}var l,u,d,f,p,m,h;function g(){return(g=e((()=>{i(),n(),o(),l=t(),u=[{href:`#recursos`,label:`Recursos`},{href:`#como-funciona`,label:`Como funciona`},{href:`#planos`,label:`Planos`},{href:`#duvidas`,label:`Dúvidas`}],d={title:`Organisms/MarketingHeader`,component:s,tags:[`autodocs`],args:{homeHref:`#`,links:u,cta:{href:`#construindo`,label:`Começar grátis`}},argTypes:{homeHref:{control:`text`,description:`Destino do logo, em geral a página inicial`},links:{control:`object`,description:"Links da navegação; `current` marca a página aberta"},cta:{control:`object`,description:`Chamada principal, sempre visível`},contentId:{control:`text`,description:"`id` do conteúdo principal, destino do link de pular"}},parameters:{layout:`fullscreen`,docs:{description:{component:"Cabeçalho do site da Purpler, sempre com a marca Purpler. O primeiro Tab mostra o link “Pular para o conteúdo”, que leva ao `#conteudo` (o `MarketingLayout` já cria o `main` com esse `id`). Em telas largas, os links ficam na barra. No celular, um botão abre os mesmos links num `Sheet`. Sem JavaScript, o botão some e os links aparecem embaixo da barra, então a página pré-renderizada continua navegável. Rotas e textos vêm todos por props."}}},render:e=>(0,l.jsx)(c,{...e})},f={},p={args:{links:u.map(e=>({...e,current:e.label===`Planos`}))}},m={parameters:{controls:{disable:!0}},render:e=>(0,l.jsxs)(`div`,{className:`grid gap-8`,children:[(0,l.jsx)(s,{...e}),(0,l.jsx)(s,{...e,links:u.map(e=>({...e,current:e.label===`Recursos`})),cta:{href:`#construindo`,label:`Criar minha loja grátis`}}),(0,l.jsx)(`main`,{id:`conteudo`,tabIndex:-1,className:`px-4 outline-none`,children:(0,l.jsx)(r,{tone:`muted`,children:`Conteúdo da página.`})})]})},h=[`Default`,`CurrentPage`,`AllVariants`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    links: LINKS.map(link => ({
      ...link,
      current: link.label === 'Planos'
    }))
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: args => <div className="grid gap-8">
      <MarketingHeader {...args} />
      <MarketingHeader {...args} links={LINKS.map(link => ({
      ...link,
      current: link.label === 'Recursos'
    }))} cta={{
      href: '#construindo',
      label: 'Criar minha loja grátis'
    }} />
      <main id="conteudo" tabIndex={-1} className="px-4 outline-none">
        <Text tone="muted">Conteúdo da página.</Text>
      </main>
    </div>
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as AllVariants,p as CurrentPage,f as Default,h as __namedExportsOrder,d as default};