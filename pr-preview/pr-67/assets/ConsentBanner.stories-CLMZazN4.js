import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DvvP-0SR.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{i as r,n as i,r as a,t as o}from"./FloatingContactLink-CC0Yv2Kd.js";import{i as s,n as c,r as l,t as u}from"./dist-Be47NwFh.js";import{n as d,t as f}from"./Text-u5d8PBf7.js";import{n as p,t as m}from"./Button-Baz-k9Ie.js";import{n as h,t as g}from"./Heading-Bc7OvTrG.js";import{n as _,t as v}from"./MarketingFooter-BaCw8EZX.js";import{n as y,t as b}from"./MarketingHeader-0Mjte39k.js";import{n as x,t as S}from"./MarketingLayout-Bp6IkM16.js";var C,w,T;function E(){return(E=e((()=>{c(),C=`--consent-banner-height`,w=u([`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background font-sans text-foreground shadow-lg`,`px-4 pt-4 pb-[calc(--spacing(4)+env(safe-area-inset-bottom))] md:px-6`]),T=u([`rounded-sm font-semibold text-primary underline underline-offset-4`,`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`])})))()}function D(e){(0,k.useEffect)(()=>{let t=e.current;if(!t)return;let n=document.documentElement.style,r=()=>{n.setProperty(C,`${String(Math.ceil(t.offsetHeight))}px`)};r();let i=typeof ResizeObserver>`u`?void 0:new ResizeObserver(r);return i?.observe(t),()=>{i?.disconnect(),n.removeProperty(C)}},[e])}function O({className:e,description:t,privacyHref:n,onAccept:r,onReject:i,focusOnMount:a=!1,title:o=`Cookies e privacidade`,privacyLabel:s=`Política de privacidade`,acceptLabel:c=`Aceitar`,rejectLabel:u=`Recusar`,...d}){let p=(0,k.useId)(),h=(0,k.useRef)(null),_=(0,k.useRef)(null);return D(_),(0,k.useEffect)(()=>{a&&h.current?.focus()},[a]),(0,A.jsx)(`section`,{ref:_,"data-slot":`consent-banner`,"aria-labelledby":p,className:l(w(),e),...d,children:(0,A.jsxs)(`div`,{className:`mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between`,children:[(0,A.jsxs)(`div`,{className:`grid gap-1`,children:[(0,A.jsx)(g,{ref:h,id:p,level:2,size:`title-3`,tabIndex:-1,children:o}),(0,A.jsxs)(f,{size:`small`,tone:`muted`,children:[t,` `,(0,A.jsx)(`a`,{href:n,className:T(),children:s})]})]}),(0,A.jsxs)(`div`,{className:`grid shrink-0 grid-cols-2 gap-3`,children:[(0,A.jsx)(m,{variant:`primary`,onClick:r,children:c}),(0,A.jsx)(m,{variant:`primary`,onClick:i,children:u})]})]})})}var k,A;function j(){return(j=e((()=>{k=t(),p(),h(),d(),s(),E(),A=n(),O.__docgenInfo={description:`Cookie notice with a choice at the bottom of the page: both buttons carry the same weight.
While open, it publishes its height so nothing on the page stays hidden under it.`,methods:[],displayName:`ConsentBanner`,props:{description:{required:!0,tsType:{name:`ReactNode`},description:`What is measured, by whom and where the data goes; the privacy link follows it.`},privacyHref:{required:!0,tsType:{name:`string`},description:``},onAccept:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onReject:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},focusOnMount:{required:!1,tsType:{name:`boolean`},description:`Moves the focus to the title on mount, as when the user reopens the banner from the footer.`,defaultValue:{value:`false`,computed:!1}},title:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Cookies e privacidade'`,computed:!1}},privacyLabel:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Política de privacidade'`,computed:!1}},acceptLabel:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Aceitar'`,computed:!1}},rejectLabel:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'Recusar'`,computed:!1}}}}})))()}var M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{r(),i(),h(),d(),x(),_(),y(),j(),M=n(),{fn:N}=__STORYBOOK_MODULE_TEST__,P={title:`Organisms/ConsentBanner`,component:O,tags:[`autodocs`],args:{description:`Usamos cookies do Google e da Meta, nos EUA, para medir o uso do site e para anúncios.`,acceptLabel:`Ok`,privacyHref:`#privacidade`,onAccept:N(),onReject:N()},argTypes:{description:{control:`text`,description:`O que é medido, por quem e para onde vão os dados`},privacyHref:{control:`text`,description:`Destino do link da política de privacidade`},focusOnMount:{control:`boolean`,description:`Leva o foco ao título ao abrir (reabertura pelo rodapé)`},title:{control:`text`},privacyLabel:{control:`text`},acceptLabel:{control:`text`},rejectLabel:{control:`text`}},parameters:{layout:`fullscreen`,docs:{description:{component:'Aviso de cookies com escolha, fixo no rodapé da página e sem bloquear a navegação. Os dois botões ("Aceitar" ou "Ok" e "Recusar") têm o mesmo peso visual. O app decide quando mostrar e o que fazer com a escolha (veja `@purplerbr/analytics`).'}}}},F=e=>(0,M.jsx)(`div`,{className:`min-h-96 translate-x-0`,children:(0,M.jsx)(e,{})}),I={decorators:[F]},L={args:{focusOnMount:!0},decorators:[F]},R={parameters:{controls:{disable:!0}},render:e=>(0,M.jsx)(`div`,{className:`grid gap-6`,children:[{label:`Rótulos padrão`,props:{}},{label:`OK e Recusar`,props:{acceptLabel:`OK`}},{label:`Reaberto pelo rodapé (foco no título)`,props:{acceptLabel:`OK`,focusOnMount:!0}}].map(({label:t,props:n})=>(0,M.jsxs)(`section`,{"aria-label":t,className:`grid gap-2`,children:[(0,M.jsx)(f,{size:`small`,tone:`muted`,className:`px-4`,children:t}),(0,M.jsx)(`div`,{className:`relative min-h-56 translate-x-0`,children:(0,M.jsx)(O,{...e,...n})})]},t))})},z={args:{acceptLabel:`OK`},render:e=>(0,M.jsxs)(S,{header:(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(O,{...e}),(0,M.jsx)(b,{homeHref:`#`,links:[{href:`#planos`,label:`Planos`}],cta:{href:`#entrar`,label:`Entrar`}})]}),footer:(0,M.jsx)(v,{homeHref:`#`,links:[{href:`#termos`,label:`Termos de uso`},{href:`#privacidade`,label:`Política de privacidade`}],contact:{label:`Fale com a gente:`,email:`contato@purpler.com.br`},note:`© 2026 Purpler`}),children:[(0,M.jsxs)(`div`,{className:`mx-auto grid max-w-6xl gap-6 px-4 py-12 md:px-6`,children:[(0,M.jsx)(g,{level:1,size:`display`,children:`Sua loja online com a sua marca`}),(0,M.jsx)(f,{size:`body-lg`,tone:`muted`,children:`Venda produtos físicos, digitais e cursos com as suas contas de pagamento.`})]}),(0,M.jsx)(o,{href:`#whatsapp`,label:`WhatsApp`,icon:(0,M.jsx)(a,{})})]})},B=[`Default`,`Reopened`,`AllVariants`,`OnMarketingPage`],I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  decorators: [inBox]
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    focusOnMount: true
  },
  decorators: [inBox]
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: args => <div className="grid gap-6">
      {[{
      label: 'Rótulos padrão',
      props: {}
    }, {
      label: 'OK e Recusar',
      props: {
        acceptLabel: 'OK'
      }
    }, {
      label: 'Reaberto pelo rodapé (foco no título)',
      props: {
        acceptLabel: 'OK',
        focusOnMount: true
      }
    }].map(({
      label,
      props
    }) => <section key={label} aria-label={label} className="grid gap-2">
          <Text size="small" tone="muted" className="px-4">
            {label}
          </Text>
          <div className="relative min-h-56 translate-x-0">
            <ConsentBanner {...args} {...props} />
          </div>
        </section>)}
    </div>
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    acceptLabel: 'OK'
  },
  render: args => <MarketingLayout header={<>
          <ConsentBanner {...args} />
          <MarketingHeader homeHref="#" links={[{
      href: '#planos',
      label: 'Planos'
    }]} cta={{
      href: '#entrar',
      label: 'Entrar'
    }} />
        </>} footer={<MarketingFooter homeHref="#" links={[{
    href: '#termos',
    label: 'Termos de uso'
  }, {
    href: '#privacidade',
    label: 'Política de privacidade'
  }]} contact={{
    label: 'Fale com a gente:',
    email: 'contato@purpler.com.br'
  }} note="© 2026 Purpler" />}>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:px-6">
        <Heading level={1} size="display">
          Sua loja online com a sua marca
        </Heading>
        <Text size="body-lg" tone="muted">
          Venda produtos físicos, digitais e cursos com as suas contas de pagamento.
        </Text>
      </div>
      <FloatingContactLink href="#whatsapp" label="WhatsApp" icon={<MessageCircle />} />
    </MarketingLayout>
}`,...z.parameters?.docs?.source}}}})))()}V();export{R as AllVariants,I as Default,z as OnMarketingPage,L as Reopened,B as __namedExportsOrder,P as default};