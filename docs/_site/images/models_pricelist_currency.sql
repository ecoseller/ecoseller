digraph model_graph {
  // Dotfile by Django-Extensions graph_models
  // Created: 2023-07-15 16:05
  // Cli Options: -a -d -

  fontname = "Roboto"
  fontsize = 8
  splines  = true
  rankdir = "TB"

  node [
    fontname = "Roboto"
    fontsize = 8
    shape = "plaintext"
  ]

  edge [
    fontname = "Roboto"
    fontsize = 8
  ]

  // Labels


  country_models_Country [label=<
    <TABLE BGCOLOR="white" BORDER="1" CELLBORDER="0" CELLSPACING="0">
    <TR><TD COLSPAN="2" CELLPADDING="5" ALIGN="CENTER" BGCOLOR="#1b563f">
    <FONT FACE="Roboto" COLOR="white" POINT-SIZE="10"><B>
    Country<BR/>&lt;<FONT FACE="Roboto"><I>SafeDeleteModel</I></FONT>&gt;
    </B></FONT></TD></TR>
  
    </TABLE>
    >]

  country_models_Currency [label=<
    <TABLE BGCOLOR="white" BORDER="1" CELLBORDER="0" CELLSPACING="0">
    <TR><TD COLSPAN="2" CELLPADDING="5" ALIGN="CENTER" BGCOLOR="#1b563f">
    <FONT FACE="Roboto" COLOR="white" POINT-SIZE="10"><B>
    Currency<BR/>&lt;<FONT FACE="Roboto"><I>SafeDeleteModel</I></FONT>&gt;
    </B></FONT></TD></TR>
  
    </TABLE>
    >]

  country_models_VatGroup [label=<
    <TABLE BGCOLOR="white" BORDER="1" CELLBORDER="0" CELLSPACING="0">
    <TR><TD COLSPAN="2" CELLPADDING="5" ALIGN="CENTER" BGCOLOR="#1b563f">
    <FONT FACE="Roboto" COLOR="white" POINT-SIZE="10"><B>
    VatGroup<BR/>&lt;<FONT FACE="Roboto"><I>SafeDeleteModel</I></FONT>&gt;
    </B></FONT></TD></TR>
  
    </TABLE>
    >]

  product_models_PriceList [label=<
    <TABLE BGCOLOR="white" BORDER="1" CELLBORDER="0" CELLSPACING="0">
    <TR><TD COLSPAN="2" CELLPADDING="5" ALIGN="CENTER" BGCOLOR="#1b563f">
    <FONT FACE="Roboto" COLOR="white" POINT-SIZE="10"><B>
    PriceList<BR/>&lt;<FONT FACE="Roboto"><I>SafeDeleteModel</I></FONT>&gt;
    </B></FONT></TD></TR>
  
    </TABLE>
    >]

  product_models_ProductPrice [label=<
    <TABLE BGCOLOR="white" BORDER="1" CELLBORDER="0" CELLSPACING="0">
    <TR><TD COLSPAN="2" CELLPADDING="5" ALIGN="CENTER" BGCOLOR="#1b563f">
    <FONT FACE="Roboto" COLOR="white" POINT-SIZE="10"><B>
    ProductPrice<BR/>&lt;<FONT FACE="Roboto"><I>SafeDeleteModel</I></FONT>&gt;
    </B></FONT></TD></TR>
  
    </TABLE>
    >]

  country_models_Country -> product_models_PriceList
  [label=" default_price_list (country)"] [arrowhead=none, arrowtail=dot, dir=both];

  country_models_VatGroup -> country_models_Country
  [label=" country (vatgroup)"] [arrowhead=none, arrowtail=dot, dir=both];

  product_models_ProductType -> country_models_VatGroup
  [label=" vat_groups (product_types)"] [arrowhead=dot arrowtail=dot, dir=both];

  product_models_PriceList -> country_models_Currency
  [label=" currency (pricelist)"] [arrowhead=none, arrowtail=dot, dir=both];

  product_models_ProductPrice -> product_models_PriceList
  [label=" price_list (productprice)"] [arrowhead=none, arrowtail=dot, dir=both];

  product_models_ProductPrice -> product_models_ProductVariant
  [label=" product_variant (price)"] [arrowhead=none, arrowtail=dot, dir=both];
}
