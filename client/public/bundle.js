
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/components/pages/Header.svelte generated by Svelte v3.9.1 */

    const file = "src/components/pages/Header.svelte";

    function create_fragment(ctx) {
    	var div, ul, li0, t1, li1, t3, li2, t5, li3, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Home";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "About";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Contact";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "ToDo";
    			attr(li0, "class", "header-link svelte-ma2i4d");
    			add_location(li0, file, 36, 4, 672);
    			attr(li1, "class", "header-link svelte-ma2i4d");
    			add_location(li1, file, 37, 4, 710);
    			attr(li2, "class", "header-link svelte-ma2i4d");
    			add_location(li2, file, 38, 4, 749);
    			attr(li3, "class", "header-link svelte-ma2i4d");
    			add_location(li3, file, 39, 4, 790);
    			attr(ul, "class", "link-container svelte-ma2i4d");
    			add_location(ul, file, 35, 2, 616);
    			attr(div, "class", "header-container svelte-ma2i4d");
    			add_location(div, file, 34, 0, 583);
    			dispose = listen(ul, "click", ctx.handleSelect);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, ul);
    			append(ul, li0);
    			append(ul, t1);
    			append(ul, li1);
    			append(ul, t3);
    			append(ul, li2);
    			append(ul, t5);
    			append(ul, li3);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { handleSelect } = $$props;

      // function handleClick(event) {
      //   handleSelect(event.target.textContent);
      //   console.log(event.target.textContent);
      // }

    	const writable_props = ['handleSelect'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('handleSelect' in $$props) $$invalidate('handleSelect', handleSelect = $$props.handleSelect);
    	};

    	return { handleSelect };
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["handleSelect"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.handleSelect === undefined && !('handleSelect' in props)) {
    			console.warn("<Header> was created without expected prop 'handleSelect'");
    		}
    	}

    	get handleSelect() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleSelect(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/messageComponents/ErrorMessage.svelte generated by Svelte v3.9.1 */

    const file$1 = "src/components/messageComponents/ErrorMessage.svelte";

    function create_fragment$1(ctx) {
    	var h1, t0_value = ctx.error.status + "", t0, t1, t2, p, t3, t4_value = ctx.error.message + "", t4;

    	return {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = text(": Whooops! Something went wrong");
    			t2 = space();
    			p = element("p");
    			t3 = text("Message: ");
    			t4 = text(t4_value);
    			add_location(h1, file$1, 8, 0, 89);
    			add_location(p, file$1, 9, 0, 144);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, h1, anchor);
    			append(h1, t0);
    			append(h1, t1);
    			insert(target, t2, anchor);
    			insert(target, p, anchor);
    			append(p, t3);
    			append(p, t4);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.error) && t0_value !== (t0_value = ctx.error.status + "")) {
    				set_data(t0, t0_value);
    			}

    			if ((changed.error) && t4_value !== (t4_value = ctx.error.message + "")) {
    				set_data(t4, t4_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h1);
    				detach(t2);
    				detach(p);
    			}
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { error = { message: '', status: '' } } = $$props;

    	const writable_props = ['error'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<ErrorMessage> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('error' in $$props) $$invalidate('error', error = $$props.error);
    	};

    	return { error };
    }

    class ErrorMessage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["error"]);
    	}

    	get error() {
    		throw new Error("<ErrorMessage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<ErrorMessage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/pages/Home.svelte generated by Svelte v3.9.1 */

    const file$2 = "src/components/pages/Home.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.post = list[i];
    	return child_ctx;
    }

    // (36:0) {:else}
    function create_else_block(ctx) {
    	var ol;

    	var each_value = ctx.posts;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			ol = element("ol");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			add_location(ol, file$2, 36, 2, 813);
    		},

    		m: function mount(target, anchor) {
    			insert(target, ol, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.posts) {
    				each_value = ctx.posts;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(ol);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (34:0) {#if isError}
    function create_if_block(ctx) {
    	var current;

    	var errormessage = new ErrorMessage({
    		props: { error: ctx.error },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			errormessage.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(errormessage, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var errormessage_changes = {};
    			if (changed.error) errormessage_changes.error = ctx.error;
    			errormessage.$set(errormessage_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(errormessage.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(errormessage.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(errormessage, detaching);
    		}
    	};
    }

    // (38:4) {#each posts as post}
    function create_each_block(ctx) {
    	var li, h3, t0_value = ctx.post.title + "", t0, t1, p, t2_value = ctx.post.body + "", t2, t3;

    	return {
    		c: function create() {
    			li = element("li");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			add_location(h3, file$2, 39, 8, 863);
    			add_location(p, file$2, 40, 8, 893);
    			add_location(li, file$2, 38, 6, 850);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, h3);
    			append(h3, t0);
    			append(li, t1);
    			append(li, p);
    			append(p, t2);
    			append(li, t3);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.posts) && t0_value !== (t0_value = ctx.post.title + "")) {
    				set_data(t0, t0_value);
    			}

    			if ((changed.posts) && t2_value !== (t2_value = ctx.post.body + "")) {
    				set_data(t2, t2_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	var h2, t0_value = ctx.message.message ? ctx.message.message : 'Loading...' + "", t0, t1, current_block_type_index, if_block, if_block_anchor, current;

    	var if_block_creators = [
    		create_if_block,
    		create_else_block
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.isError) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(h2, file$2, 31, 0, 701);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, h2, anchor);
    			append(h2, t0);
    			insert(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.message) && t0_value !== (t0_value = ctx.message.message ? ctx.message.message : 'Loading...' + "")) {
    				set_data(t0, t0_value);
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h2);
    				detach(t1);
    			}

    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	

      let posts = [];
      let error = {};

      let isError = false;

      let message = {};

      onMount(async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (response.status === 200) {
          const data = await response.json();
          $$invalidate('posts', posts = [...posts, ...data]);
        } else {
          $$invalidate('isError', isError = true);
          $$invalidate('error', error = { message: response.statusText, status: response.status });
        }

        const helloRes = await fetch('http://localhost:8000/hello');
        const helloData = await helloRes.json();
        $$invalidate('message', message = helloData);
      });

    	return { posts, error, isError, message };
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, []);
    	}
    }

    /* src/components/pages/About.svelte generated by Svelte v3.9.1 */

    const file$3 = "src/components/pages/About.svelte";

    function create_fragment$3(ctx) {
    	var p;

    	return {
    		c: function create() {
    			p = element("p");
    			p.textContent = "About Page";
    			add_location(p, file$3, 8, 0, 40);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$3, safe_not_equal, []);
    	}
    }

    /* src/components/pages/Contact.svelte generated by Svelte v3.9.1 */

    const file$4 = "src/components/pages/Contact.svelte";

    function create_fragment$4(ctx) {
    	var p;

    	return {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Contact Me";
    			attr(p, "class", "svelte-yucpru");
    			add_location(p, file$4, 10, 0, 68);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, p, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(p);
    			}
    		}
    	};
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$4, safe_not_equal, []);
    	}
    }

    /* src/components/toDo/ToDoItem.svelte generated by Svelte v3.9.1 */

    const file$5 = "src/components/toDo/ToDoItem.svelte";

    function create_fragment$5(ctx) {
    	var div4, div3, div2, div0, span, t0, t1, p, t2, t3, div1, a0, t5, a1, t7, a2;

    	return {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(ctx.title);
    			t1 = space();
    			p = element("p");
    			t2 = text(ctx.body);
    			t3 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Complete";
    			t5 = space();
    			a1 = element("a");
    			a1.textContent = "Edit";
    			t7 = space();
    			a2 = element("a");
    			a2.textContent = "Delete";
    			attr(span, "class", "card-title");
    			add_location(span, file$5, 13, 8, 197);
    			add_location(p, file$5, 14, 8, 245);
    			attr(div0, "class", "card-content");
    			add_location(div0, file$5, 12, 6, 162);
    			attr(a0, "href", "#");
    			add_location(a0, file$5, 17, 8, 312);
    			attr(a1, "href", "#");
    			add_location(a1, file$5, 18, 8, 345);
    			attr(a2, "href", "#");
    			add_location(a2, file$5, 19, 8, 374);
    			attr(div1, "class", "card-action");
    			add_location(div1, file$5, 16, 6, 278);
    			attr(div2, "class", "card");
    			add_location(div2, file$5, 11, 4, 137);
    			attr(div3, "class", "col s12 m6");
    			add_location(div3, file$5, 10, 2, 108);
    			attr(div4, "class", "row");
    			add_location(div4, file$5, 9, 0, 88);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, div2);
    			append(div2, div0);
    			append(div0, span);
    			append(span, t0);
    			append(div0, t1);
    			append(div0, p);
    			append(p, t2);
    			append(div2, t3);
    			append(div2, div1);
    			append(div1, a0);
    			append(div1, t5);
    			append(div1, a1);
    			append(div1, t7);
    			append(div1, a2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.title) {
    				set_data(t0, ctx.title);
    			}

    			if (changed.body) {
    				set_data(t2, ctx.body);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div4);
    			}
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { title = '', body = '' } = $$props;

    	const writable_props = ['title', 'body'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<ToDoItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('body' in $$props) $$invalidate('body', body = $$props.body);
    	};

    	return { title, body };
    }

    class ToDoItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$5, safe_not_equal, ["title", "body"]);
    	}

    	get title() {
    		throw new Error("<ToDoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ToDoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<ToDoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<ToDoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/pages/ToDo.svelte generated by Svelte v3.9.1 */

    const file$6 = "src/components/pages/ToDo.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (24:0) {#each obj as item}
    function create_each_block$1(ctx) {
    	var current;

    	var todoitem_spread_levels = [
    		ctx.item
    	];

    	let todoitem_props = {};
    	for (var i = 0; i < todoitem_spread_levels.length; i += 1) {
    		todoitem_props = assign(todoitem_props, todoitem_spread_levels[i]);
    	}
    	var todoitem = new ToDoItem({ props: todoitem_props, $$inline: true });

    	return {
    		c: function create() {
    			todoitem.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(todoitem, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var todoitem_changes = (changed.obj) ? get_spread_update(todoitem_spread_levels, [
    									ctx.item
    								]) : {};
    			todoitem.$set(todoitem_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(todoitem.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(todoitem.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(todoitem, detaching);
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	var h3, t_1, each_1_anchor, current;

    	var each_value = ctx.obj;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "ToDo Page";
    			t_1 = space();

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			add_location(h3, file$6, 21, 0, 608);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, h3, anchor);
    			insert(target, t_1, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.obj) {
    				each_value = ctx.obj;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h3);
    				detach(t_1);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    function instance$4($$self) {
    	let obj = [
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' },
        { title: 'Test One Two', body: 'Test Body' }
      ];

    	return { obj };
    }

    class ToDo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$6, safe_not_equal, []);
    	}
    }

    /* src/App.svelte generated by Svelte v3.9.1 */

    const file$7 = "src/App.svelte";

    function create_fragment$7(ctx) {
    	var div, t, main, current;

    	var header = new Header({
    		props: { handleSelect: ctx.handleSelect },
    		$$inline: true
    	});

    	var switch_value = ctx.state[ctx.selected];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	return {
    		c: function create() {
    			div = element("div");
    			header.$$.fragment.c();
    			t = space();
    			main = element("main");
    			if (switch_instance) switch_instance.$$.fragment.c();
    			attr(main, "class", "svelte-1lm8tcl");
    			add_location(main, file$7, 35, 2, 669);
    			attr(div, "class", "app-container svelte-1lm8tcl");
    			add_location(div, file$7, 33, 0, 611);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(header, div, null);
    			append(div, t);
    			append(div, main);

    			if (switch_instance) {
    				mount_component(switch_instance, main, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var header_changes = {};
    			if (changed.handleSelect) header_changes.handleSelect = ctx.handleSelect;
    			header.$set(header_changes);

    			if (switch_value !== (switch_value = ctx.state[ctx.selected])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, main, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);

    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(header);

    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	

      let state = {
        Home,
        About,
        Contact,
        ToDo
      };

      const handleSelect = e => {
        $$invalidate('selected', selected = event.target.textContent);
      };

      let selected = 'ToDo';

    	return { state, handleSelect, selected };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$7, safe_not_equal, ["handleSelect"]);
    	}

    	get handleSelect() {
    		return this.$$.ctx.handleSelect;
    	}

    	set handleSelect(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
      target: document.body,
      props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map