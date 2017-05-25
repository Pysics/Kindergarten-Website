jQuery(document).ready(function () {

	// 菜单选中状态
	switch (location.pathname) {
		case '/':
			jQuery('#menu-item-537').addClass('current-menu-ancestor current-menu-parent')
			break;
		case '/news':
			jQuery('#menu-item-356').addClass('current-menu-ancestor current-menu-parent')
			break;
		case '/gallery':
			jQuery('#menu-item-358').addClass('current-menu-ancestor current-menu-parent')
			break;
		case '/course':
			jQuery('#menu-item-368').addClass('current-menu-ancestor current-menu-parent')
			break;
		case '/about':
			jQuery('#menu-item-581').addClass('current-menu-ancestor current-menu-parent')
			break;
		case '/contact':
			jQuery('#menu-item-354').addClass('current-menu-ancestor current-menu-parent')
			break;
		default:
			break;
	}

	// 数字月份 => 英文月份
	const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Oct', 'Dec'];
	jQuery('.event-month').text(monthList[jQuery('.event-month').text()])

})
