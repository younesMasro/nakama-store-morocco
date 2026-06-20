module.exports=[50640,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"InvariantError",{enumerable:!0,get:function(){return d}});class d extends Error{constructor(a,b){super(`Invariant: ${a.endsWith(".")?a:a+"."} This is a bug in Next.js.`,b),this.name="InvariantError"}}},93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},71306,(a,b,c)=>{b.exports=a.r(18622)},79847,a=>{a.n(a.i(3343))},9185,a=>{a.n(a.i(29432))},72842,a=>{a.n(a.i(75164))},54897,a=>{a.n(a.i(30106))},56157,a=>{a.n(a.i(18970))},94331,a=>{a.n(a.i(60644))},15988,a=>{a.n(a.i(56952))},25766,a=>{a.n(a.i(77341))},29725,a=>{a.n(a.i(94290))},90833,a=>{a.n(a.i(46994))},5785,a=>{a.n(a.i(90588))},74793,a=>{a.n(a.i(33169))},85826,a=>{a.n(a.i(37111))},21565,a=>{a.n(a.i(41763))},65911,a=>{a.n(a.i(8950))},25128,a=>{a.n(a.i(91562))},40781,a=>{a.n(a.i(49670))},69411,a=>{a.n(a.i(75700))},63081,a=>{a.n(a.i(276))},62837,a=>{a.n(a.i(40795))},34607,a=>{a.n(a.i(11614))},96338,a=>{a.n(a.i(21751))},50642,a=>{a.n(a.i(12213))},32242,a=>{a.n(a.i(22693))},88530,a=>{a.n(a.i(10531))},8583,a=>{a.n(a.i(1082))},38534,a=>{a.n(a.i(98175))},70408,a=>{a.n(a.i(9095))},22922,a=>{a.n(a.i(96772))},78294,a=>{a.n(a.i(71717))},16625,a=>{a.n(a.i(85034))},88648,a=>{a.n(a.i(68113))},51914,a=>{a.n(a.i(66482))},25466,a=>{a.n(a.i(91505))},22734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},48983,a=>{"use strict";let b=process.env.WORDPRESS_GRAPHQL_URL??"https://admin.nakamastore.ma/graphql"??"https://admin.nakamastore.ma/graphql";async function c(a,c,d){let e,f=new AbortController,g=setTimeout(()=>f.abort(),2e3);try{e=await fetch(b,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({query:a,variables:c}),signal:f.signal,next:void 0!==d?{revalidate:d}:void 0})}finally{clearTimeout(g)}if(!e.ok)throw Error(`[Nakama] GraphQL HTTP ${e.status} ${e.statusText} — ${b}`);let h=await e.json();if(h.errors?.length){let a=h.errors[0].message;throw(a.toLowerCase().includes("products")||a.toLowerCase().includes("woo")||a.toLowerCase().includes("unknown field"))&&console.error("[Nakama] ⚠️  WooGraphQL may not be active. Enable 'WPGraphQL for WooCommerce' plugin in WordPress admin.","\nGraphQL error:",a),Error(`[Nakama] GraphQL error: ${a}`)}return h.data}let d=`
  query GetProducts {
    products(first: 20, where: { status: "publish" }) {
      nodes {
        id
        databaseId
        name
        slug
        description
        shortDescription
        image {
          sourceUrl
        }
        galleryImages {
          nodes {
            sourceUrl
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`,e=`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      image {
        sourceUrl
      }
      galleryImages {
        nodes {
          sourceUrl
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
    }
  }
`;function f(){try{let b=a.r(22734),c=a.r(14747).join(process.cwd(),".nakama-cache","products.json");if(!b.existsSync(c))return null;let d=JSON.parse(b.readFileSync(c,"utf-8"));if(Date.now()-d.savedAt>864e5)return null;return d.products}catch{return null}}async function g(){try{let b=await c(d,void 0,3600),e=b.products?.nodes??[];return e.length>0&&function(b){try{let c=a.r(22734),d=a.r(14747),e=d.join(process.cwd(),".nakama-cache");c.existsSync(e)||c.mkdirSync(e,{recursive:!0}),c.writeFileSync(d.join(e,"products.json"),JSON.stringify({products:b,savedAt:Date.now()}),"utf-8")}catch(a){console.error("[Nakama] Failed to write product cache:",a)}}(e),e}catch(b){console.error("[Nakama] getProducts() failed.",b);let a=f();if(a)return console.log("[Nakama] Using disk-cached product data."),a;return[]}}async function h(a){try{return(await c(e,{slug:a},3600)).product??null}catch(d){let b=String(d).toLowerCase();if(b.includes("no product id")||b.includes("not found"))return null;console.error(`[Nakama] getProductBySlug("${a}") failed.`,d);let c=f();if(c)return c.find(b=>b.slug===a)??null;return null}}a.s(["formatPrice",0,function(a){if(!a)return null;let b=a?a.replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/\s+/g," ").trim():"",c=b.match(/([\d\s,]+(?:\.\d{1,2})?)/);return c?c[1].replace(/\s/g,"").replace(/\.00$/,"").replace(/,00$/,"").trim():b},"getProductBySlug",0,h,"getProducts",0,g],48983)},25333,a=>{a.v("/_next/static/media/icon.0k8vl_amm57oj.png"+(globalThis.NEXT_CLIENT_ASSET_SUFFIX||""))},21646,a=>{"use strict";let b={src:a.i(25333).default,width:4e3,height:4e3};a.s(["default",0,b])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1kjgfvs._.js.map