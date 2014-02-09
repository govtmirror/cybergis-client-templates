/*
===========Author===========
U.S. Department of State, Humanitarian Information Unit

===========Version===========
1.0 / February 8, 2014

===========Description===========
The cybergis-client-geoext javascript file contains the CyberGIS client application code specific to GeoEXT, including GeoExt.AdvancedPopup.  It is neccessary for all CyberGIS client applications when they use custom popups are used.  It should come after cybergis-client-openlayers-base, cybergis-client-core, and cybergis-client-openlayers are loaded.

===========CyberGIS===========
The Humanitarian Information Unit has been developing a sophisticated geographic computing infrastructure referred to as the CyberGIS. The CyberGIS provides highly available, scalable, reliable, and timely geospatial services capable of supporting multiple concurrent projects.  The CyberGIS relies on primarily open source projects, such as PostGIS, GeoServer, GDAL, OGR, and OpenLayers.  The name CyberGIS is dervied from the term geospatial cyberinfrastructure.

===========License===========
This project constitutes a work of the United States Government and is not subject to domestic copyright protection under 17 USC § 105.

However, because the project utilizes code licensed from contributors and other third parties, it therefore is licensed under the MIT License. http://opensource.org/licenses/mit-license.php. Under that license, permission is granted free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the conditions that any appropriate copyright notices and this permission notice are included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

GeoExt.AdvancedPopup = Ext.extend(GeoExt.Popup,
{
	'anchored':true,
	'unpinnable':false,
	'resizable':false,
	'maximizable': false,
	'collapsible':false,
	'closeAction':'close',

	anchorPosition: "bottom-left",
	anchorPositionToBaseClass:
	{
		"top": {"classes":"hiu-popup-anc-top"},
		"top-left": {"classes":"hiu-popup-anc-top-left"},
		"top-right": {"classes":"hiu-popup-anc-top-right"},
		"left": {"classes":"hiu-popup-anc-left"},
		"right": {"classes":"hiu-popup-anc-right"},
		"bottom": {"classes":"hiu-popup-anc-bottom"},
		"bottom-left": {"classes":"hiu-popup-anc-bottom-left"},
		"bottom-right": {"classes":"hiu-popup-anc-bottom-right"}
	},
	
	getAnchorPosition: function()
	{
		return this.anchorPosition;
	},
	getAnchorClass: function()
	{
		if(this.anchorPositionToBaseClass[""+this.getAnchorPosition()]!=undefined)
		{
			var baseClass = this.anchorPositionToBaseClass[""+this.getAnchorPosition()].classes;
			if($.browser.msie)
				return baseClass+"-ie-"+this.width+"-"+this.height;
			else
				return baseClass+"-"+this.width+"-"+this.height;
		}
		else
			return "";		
	},
	isAnchorOnTop: function()
	{
		return this.getAnchorPosition()=="top"||this.getAnchorPosition()=="top-left"||this.getAnchorPosition()=="top-right";
	},
	isAnchorOnLeft: function()
	{
		return this.getAnchorPosition()=="left";
	},
	isAnchorOnRight: function()
	{
		return this.getAnchorPosition()=="right";
	},
	isAnchorOnBottom: function()
	{
		return this.getAnchorPosition()=="bottom"||this.getAnchorPosition()=="bottom-left"||this.getAnchorPosition()=="bottom-right";
	},
	onRender: function(ct, position)
	{
		GeoExt.Popup.superclass.onRender.call(this, ct, position);////Bypass GeoExt.Popup render function GeoExt.AdvancedPopup.superclass.onRender.call(this, ct, position);, so this overrides
		this.ancCls = this.getAnchorClass();
		this.createElement("anc", this.el.dom);
	},
	position: function()
	{
		if(this._mapMove === true)
		{
			var visible = this.map.getExtent().containsLonLat(this.location);
			if(visible !== this.isVisible())
			{
				this.setVisible(visible);
			}
		}
		if(this.isVisible())
		{
			var centerPx = this.map.getViewPortPxFromLonLat(this.location);
			var mapBox = Ext.fly(this.map.div).getBox(); 

			var anc = this.anc;
			var dx = anc.getLeft(true) + anc.getWidth() / 2;
			var dy = this.el.getHeight();
	    
			if(this.isAnchorOnTop())
			{
				dy = (-1*anc.getHeight())-6;
			}
			else if(this.isAnchorOnBottom())
			{
				dy += 4;
			}
			else if(this.isAnchorOnLeft())
			{
				dx = anc.getLeft(true);
				dy = (this.el.getHeight()/2)+4;
			}
			else if(this.isAnchorOnRight())
			{
				dx = anc.getLeft(true) + anc.getWidth()-2;
				dy = this.el.getHeight()/2;
			}
			this.setPosition(centerPx.x + mapBox.x - dx, centerPx.y + mapBox.y - dy);
		}
	},
	setPosition : function(x, y)
	{
		if(x && typeof x[1] == 'number')
        {
            y = x[1];
            x = x[0];
        }
        this.x = x;
        this.y = y;
        if(!this.boxReady){
            return this;
        }
        var adj = this.adjustPosition(x, y);
        var ax = adj.x, ay = adj.y;

        var el = this.getPositionEl();
        if(ax !== undefined || ay !== undefined){
            if(ax !== undefined && ay !== undefined){
                el.setLeftTop(ax, ay);
            }else if(ax !== undefined){
                el.setLeft(ax);
            }else if(ay !== undefined){
                el.setTop(ay);
            }
            this.onPosition(ax, ay);
            this.fireEvent('move', this, ax, ay);
        }
        return this;
    },
	initComponent: function()
	{
        GeoExt.AdvancedPopup.superclass.initComponent.call(this);
    }
});

