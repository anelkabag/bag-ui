import { LexContext, Token, Lexer, TokenValue } from "./lexer.js";
import { parseArithmeticExpression } from "./arithmetic.js";
import { computeWordParts } from "./parts.js";
import { WordImpl } from "./word.js";
WordImpl._resolve = computeWordParts;
class ArithmeticCommandImpl {
    type = "ArithmeticCommand";
    pos;
    end;
    body;
    #expression = null;
    constructor(pos, end, body) {
        this.pos = pos;
        this.end = end;
        this.body = body;
    }
    get expression() {
        if (this.#expression === null) {
            this.#expression = parseArithmeticExpression(this.body, this.pos + 2) ?? undefined;
        }
        return this.#expression;
    }
    set expression(v) {
        this.#expression = v ?? undefined;
    }
}
class ArithmeticForImpl {
    type = "ArithmeticFor";
    pos;
    end;
    body;
    #initStr;
    #testStr;
    #updateStr;
    #initPos;
    #testPos;
    #updatePos;
    #initialize = null;
    #test = null;
    #update = null;
    constructor(pos, end, body, initStr, testStr, updateStr, initPos, testPos, updatePos) {
        this.pos = pos;
        this.end = end;
        this.body = body;
        this.#initStr = initStr;
        this.#testStr = testStr;
        this.#updateStr = updateStr;
        this.#initPos = initPos;
        this.#testPos = testPos;
        this.#updatePos = updatePos;
    }
    get initialize() {
        if (this.#initialize === null) {
            if (this.#initStr) {
                const expr = parseArithmeticExpression(this.#initStr);
                if (expr)
                    offsetArith(expr, this.#initPos);
                this.#initialize = expr ?? undefined;
            }
            else {
                this.#initialize = undefined;
            }
        }
        return this.#initialize;
    }
    set initialize(v) {
        this.#initialize = v ?? undefined;
    }
    get test() {
        if (this.#test === null) {
            if (this.#testStr) {
                const expr = parseArithmeticExpression(this.#testStr);
                if (expr)
                    offsetArith(expr, this.#testPos);
                this.#test = expr ?? undefined;
            }
            else {
                this.#test = undefined;
            }
        }
        return this.#test;
    }
    set test(v) {
        this.#test = v ?? undefined;
    }
    get update() {
        if (this.#update === null) {
            if (this.#updateStr) {
                const expr = parseArithmeticExpression(this.#updateStr);
                if (expr)
                    offsetArith(expr, this.#updatePos);
                this.#update = expr ?? undefined;
            }
            else {
                this.#update = undefined;
            }
        }
        return this.#update;
    }
    set update(v) {
        this.#update = v ?? undefined;
    }
}
const CASE_TERMINATORS = {
    [Token.DoubleSemi]: ";;",
    [Token.SemiAmp]: ";&",
    [Token.DoubleSemiAmp]: ";;&",
};
const REDIRECT_OPS = {
    ">": ">",
    ">>": ">>",
    "<": "<",
    "<<": "<<",
    "<<-": "<<-",
    "<<<": "<<<",
    "<>": "<>",
    "<&": "<&",
    ">&": ">&",
    ">|": ">|",
    "&>": "&>",
    "&>>": "&>>",
};
function offsetArith(node, base) {
    node.pos += base;
    node.end += base;
    switch (node.type) {
        case "ArithmeticBinary":
            offsetArith(node.left, base);
            offsetArith(node.right, base);
            break;
        case "ArithmeticUnary":
            offsetArith(node.operand, base);
            break;
        case "ArithmeticTernary":
            offsetArith(node.test, base);
            offsetArith(node.consequent, base);
            offsetArith(node.alternate, base);
            break;
        case "ArithmeticGroup":
            offsetArith(node.expression, base);
            break;
    }
}
// Lookup tables for O(1) token classification (replaces sequential comparisons)
const listTerminators = new Uint8Array(37);
listTerminators[Token.EOF] = 1;
listTerminators[Token.RParen] = 1;
listTerminators[Token.RBrace] = 1;
listTerminators[Token.Then] = 1;
listTerminators[Token.Else] = 1;
listTerminators[Token.Elif] = 1;
listTerminators[Token.Fi] = 1;
listTerminators[Token.Do] = 1;
listTerminators[Token.Done] = 1;
listTerminators[Token.Esac] = 1;
listTerminators[Token.DoubleSemi] = 1;
listTerminators[Token.SemiAmp] = 1;
listTerminators[Token.DoubleSemiAmp] = 1;
const commandStarts = new Uint8Array(37);
commandStarts[Token.Word] = 1;
commandStarts[Token.Assignment] = 1;
commandStarts[Token.Bang] = 1;
commandStarts[Token.LParen] = 1;
commandStarts[Token.LBrace] = 1;
commandStarts[Token.DblLBracket] = 1;
commandStarts[Token.If] = 1;
commandStarts[Token.For] = 1;
commandStarts[Token.While] = 1;
commandStarts[Token.Until] = 1;
commandStarts[Token.Case] = 1;
commandStarts[Token.Function] = 1;
commandStarts[Token.Select] = 1;
commandStarts[Token.ArithCmd] = 1;
commandStarts[Token.Coproc] = 1;
commandStarts[Token.Redirect] = 1;
const UNARY_TEST_OPS = {
    "-a": 1,
    "-b": 1,
    "-c": 1,
    "-d": 1,
    "-e": 1,
    "-f": 1,
    "-g": 1,
    "-h": 1,
    "-k": 1,
    "-p": 1,
    "-r": 1,
    "-s": 1,
    "-t": 1,
    "-u": 1,
    "-v": 1,
    "-w": 1,
    "-x": 1,
    "-z": 1,
    "-n": 1,
    "-N": 1,
    "-S": 1,
    "-L": 1,
    "-G": 1,
    "-O": 1,
    "-R": 1,
};
const BINARY_TEST_OPS = {
    "==": 1,
    "!=": 1,
    "=~": 1,
    "=": 1,
    "-eq": 1,
    "-ne": 1,
    "-lt": 1,
    "-le": 1,
    "-gt": 1,
    "-ge": 1,
    "-nt": 1,
    "-ot": 1,
    "-ef": 1,
    "<": 1,
    ">": 1,
};
const EMPTY_PREFIX = [];
const EMPTY_SUFFIX = [];
const EMPTY_REDIRECTS = [];
export function parse(source) {
    const parser = new Parser(source);
    return parser.parse(source.length);
}
class Parser {
    tok;
    source;
    errors = [];
    _redirects = [];
    constructor(source) {
        this.tok = new Lexer(source);
        this.source = source;
    }
    parse(sourceLen) {
        let shebang;
        if (this.source.charCodeAt(0) === 35 && this.source.charCodeAt(1) === 33) {
            const nl = this.source.indexOf("\n");
            shebang = nl === -1 ? this.source : this.source.slice(0, nl);
        }
        const commands = this.list();
        const lexerErrors = this.tok._errors;
        if (lexerErrors !== null) {
            for (let i = 0; i < lexerErrors.length; i++)
                this.errors.push(lexerErrors[i]);
        }
        const result = {
            type: "Script",
            pos: 0,
            end: sourceLen,
            shebang,
            commands,
            errors: this.errors.length > 0 ? this.errors : undefined,
        };
        return result;
    }
    error(message, pos) {
        this.errors.push({ message, pos });
    }
    skipSemi() {
        if (this.tok.peek(LexContext.Normal).token === Token.Semi)
            this.tok.next(LexContext.Normal);
    }
    accept(token, ctx = LexContext.Normal) {
        if (this.tok.peek(ctx).token === token)
            return this.tok.next(ctx);
        return null;
    }
    acceptEnd(token, ctx = LexContext.Normal) {
        if (this.tok.peek(ctx).token === token)
            return this.tok.next(ctx).end;
        return -1;
    }
    skipNewlines(ctx = LexContext.Normal) {
        while (this.tok.peek(ctx).token === Token.Newline)
            this.tok.next(ctx);
    }
    makeStatement(command, redirects) {
        const end = redirects.length > 0 ? redirects[redirects.length - 1].end : command.end;
        return {
            type: "Statement",
            pos: command.pos,
            end,
            command,
            background: undefined,
            redirects,
        };
    }
    // list := and_or ((';' | '&' | NEWLINE) and_or)* [';' | '&' | NEWLINE]
    list() {
        const commands = [];
        this.skipNewlines(LexContext.CommandStart);
        let t = this.tok.peek(LexContext.CommandStart).token;
        if (listTerminators[t] || !commandStarts[t])
            return commands;
        const first = this.andOr();
        if (first) {
            const redirects = this._redirects;
            this._redirects = [];
            commands.push(this.makeStatement(first, redirects));
        }
        for (;;) {
            t = this.tok.peek(LexContext.Normal).token;
            if (t !== Token.Semi && t !== Token.Newline && t !== Token.Amp)
                break;
            const isBackground = t === Token.Amp;
            const sepEnd = this.tok.next(LexContext.Normal).end;
            if (isBackground) {
                const stmt = commands[commands.length - 1];
                stmt.background = true;
                stmt.end = sepEnd;
            }
            this.skipNewlines(LexContext.CommandStart);
            t = this.tok.peek(LexContext.CommandStart).token;
            if (listTerminators[t] || !commandStarts[t])
                break;
            const node = this.andOr();
            if (node) {
                const redirects = this._redirects;
                this._redirects = [];
                commands.push(this.makeStatement(node, redirects));
            }
        }
        return commands;
    }
    // and_or := pipeline (('&&' | '||') newlines pipeline)*
    andOr() {
        const first = this.pipeline();
        if (!first)
            return null;
        let t = this.tok.peek(LexContext.Normal).token;
        if (t !== Token.And && t !== Token.Or)
            return first;
        // Wrap first pipeline with any pending redirects before creating AndOr
        let wrappedFirst = first;
        if (this._redirects.length > 0) {
            wrappedFirst = this.makeStatement(first, this._redirects);
            this._redirects = [];
        }
        const commands = [wrappedFirst];
        const operators = [];
        do {
            operators.push(this.tok.next(LexContext.Normal).token === Token.And ? "&&" : "||");
            this.skipNewlines(LexContext.CommandStart);
            const next = this.pipeline();
            if (!next)
                break;
            commands.push(next);
            t = this.tok.peek(LexContext.Normal).token;
        } while (t === Token.And || t === Token.Or);
        return {
            type: "AndOr",
            pos: first.pos,
            end: commands[commands.length - 1].end,
            commands,
            operators,
        };
    }
    wrapCompoundRedirects(node) {
        const redirects = this._redirects;
        this._redirects = [];
        if (redirects.length === 0)
            return node;
        return this.makeStatement(node, redirects);
    }
    // pipeline := ['time' ['-p']] ['!'] command ('|' newlines command)*
    pipeline() {
        let time = false;
        let pipelinePos = 0;
        if (this.tok.peek(LexContext.CommandStart).token === Token.Word &&
            this.tok.peek(LexContext.CommandStart).value === "time") {
            time = true;
            pipelinePos = this.tok.next(LexContext.CommandStart).pos;
            if (this.tok.peek(LexContext.CommandStart).token === Token.Word &&
                this.tok.peek(LexContext.CommandStart).value === "-p")
                this.tok.next(LexContext.CommandStart);
        }
        const negated = this.tok.peek(LexContext.CommandStart).token === Token.Bang;
        if (negated) {
            if (!time)
                pipelinePos = this.tok.peek(LexContext.CommandStart).pos;
            this.tok.next(LexContext.CommandStart);
        }
        const first = this.command();
        if (!first) {
            if (time || negated) {
                const pipeline = {
                    type: "Pipeline",
                    pos: pipelinePos,
                    end: pipelinePos,
                    commands: [],
                    negated: negated ? true : undefined,
                    operators: [],
                    time: time ? true : undefined,
                };
                return pipeline;
            }
            return null;
        }
        if (!time && !negated)
            pipelinePos = first.pos;
        const commands = [first];
        const operators = [];
        // Save _redirects from first command — only wrap in Statement if piped
        let firstRedirects = this._redirects;
        this._redirects = [];
        while (this.tok.peek(LexContext.Normal).token === Token.Pipe) {
            if (commands.length === 1 && firstRedirects.length > 0) {
                commands[0] = this.makeStatement(first, firstRedirects);
                firstRedirects = [];
            }
            const pipeVal = this.tok.next(LexContext.Normal).value;
            operators.push(pipeVal === "|&" ? "|&" : "|");
            this.skipNewlines(LexContext.CommandStart);
            const cmd = this.command();
            if (cmd)
                commands.push(this.wrapCompoundRedirects(cmd));
        }
        if (commands.length === 1 && !negated && !time) {
            // Pass redirects up for list() to consume
            this._redirects = firstRedirects;
            return commands[0];
        }
        // Wrap first command's compound redirects in Statement if needed
        if (firstRedirects.length > 0) {
            commands[0] = this.makeStatement(first, firstRedirects);
        }
        const pipeline = {
            type: "Pipeline",
            pos: pipelinePos,
            end: commands[commands.length - 1].end,
            commands,
            negated: negated ? true : undefined,
            operators,
            time: time ? true : undefined,
        };
        return pipeline;
    }
    // command := compound_command | function_def | simple_command
    command() {
        switch (this.tok.peek(LexContext.CommandStart).token) {
            case Token.LParen:
                return this.subshell();
            case Token.LBrace:
                return this.braceGroup();
            case Token.If:
                return this.ifClause();
            case Token.For:
                return this.forClause();
            case Token.While:
                return this.whileClause();
            case Token.Until:
                return this.untilClause();
            case Token.Case:
                return this.caseClause();
            case Token.Function:
                return this.functionDef();
            case Token.Select:
                return this.selectClause();
            case Token.DblLBracket:
                return this.testCommand();
            case Token.ArithCmd:
                return this.arithCommand();
            case Token.Coproc:
                return this.coprocCommand();
            case Token.Word:
            case Token.Assignment:
            case Token.Redirect:
                return this.simpleCommandOrFunction();
            default:
                return null;
        }
    }
    collectTrailingRedirects() {
        let redirects = [];
        while (this.tok.peek(LexContext.Normal).token === Token.Redirect) {
            redirects = this.collectRedirect(redirects, LexContext.Normal);
        }
        return redirects;
    }
    // arith_command := (( expr ))
    arithCommand() {
        const tok = this.tok.next(LexContext.CommandStart);
        this._redirects = this.collectTrailingRedirects();
        return new ArithmeticCommandImpl(tok.pos, tok.end, tok.value);
    }
    // coproc := COPROC [name] command [redirections]
    coprocCommand() {
        const startTok = this.tok.next(LexContext.CommandStart);
        const pos = startTok.pos;
        const startEnd = startTok.end;
        const t = this.tok.peek(LexContext.CommandStart);
        // If next token starts a compound command, no name — parse full pipeline
        if (t.token !== Token.Word && t.token !== Token.Assignment && t.token !== Token.Redirect) {
            const body = this.pipeline() ?? {
                type: "Command",
                pos,
                end: startEnd,
                name: undefined,
                prefix: EMPTY_PREFIX,
                suffix: EMPTY_SUFFIX,
                redirects: EMPTY_REDIRECTS,
            };
            const bodyRedirects = this._redirects;
            this._redirects = [];
            const redirects = this.collectTrailingRedirects();
            const allRedirects = [...bodyRedirects, ...redirects];
            const end = allRedirects.length > 0 ? allRedirects[allRedirects.length - 1].end : body.end;
            return { type: "Coproc", pos, end, name: undefined, body, redirects: allRedirects };
        }
        // Consume first word as tentative name
        const tentativeWord = this.toWord(this.tok.next(LexContext.CommandStart));
        // Try to parse what follows as a pipeline
        const body = this.pipeline();
        if (body === null) {
            const cmd = {
                type: "Command",
                pos: tentativeWord.pos,
                end: tentativeWord.end,
                name: tentativeWord,
                prefix: EMPTY_PREFIX,
                suffix: EMPTY_SUFFIX,
                redirects: EMPTY_REDIRECTS,
            };
            const redirects = this.collectTrailingRedirects();
            const end = redirects.length > 0 ? redirects[redirects.length - 1].end : cmd.end;
            return { type: "Coproc", pos, end, name: undefined, body: cmd, redirects };
        }
        if (body.type === "Command") {
            const cmd = body;
            if (cmd.name) {
                cmd.suffix = [cmd.name, ...cmd.suffix];
            }
            cmd.name = tentativeWord;
            cmd.pos = tentativeWord.pos;
            const redirects = this.collectTrailingRedirects();
            const end = redirects.length > 0 ? redirects[redirects.length - 1].end : cmd.end;
            return { type: "Coproc", pos, end, name: undefined, body: cmd, redirects };
        }
        // Pipeline or compound command — tentative "name" IS the coproc name
        const bodyRedirects = this._redirects;
        this._redirects = [];
        const redirects = this.collectTrailingRedirects();
        const allRedirects = [...bodyRedirects, ...redirects];
        const end = allRedirects.length > 0 ? allRedirects[allRedirects.length - 1].end : body.end;
        return { type: "Coproc", pos, end, name: tentativeWord, body, redirects: allRedirects };
    }
    // subshell := '(' list ')'
    subshell() {
        const pos = this.tok.next(LexContext.CommandStart).pos;
        const commands = this.list();
        const closeEnd = this.acceptEnd(Token.RParen, LexContext.Normal);
        if (closeEnd < 0)
            this.error("expected ')' to close subshell", this.tok.getPos());
        const end = closeEnd >= 0 ? closeEnd : pos;
        this._redirects = this.collectTrailingRedirects();
        return { type: "Subshell", pos, end, body: this.makeCompoundList(commands) };
    }
    // brace_group := '{' list '}'
    braceGroup() {
        const pos = this.tok.next(LexContext.CommandStart).pos;
        const commands = this.list();
        const closeEnd = this.acceptEnd(Token.RBrace, LexContext.Normal);
        if (closeEnd < 0)
            this.error("expected '}' to close brace group", this.tok.getPos());
        const end = closeEnd >= 0 ? closeEnd : pos;
        this._redirects = this.collectTrailingRedirects();
        return { type: "BraceGroup", pos, end, body: this.makeCompoundList(commands) };
    }
    // if_clause := IF list THEN list (ELIF list THEN list)* [ELSE list] FI
    ifClause() {
        const pos = this.tok.next(LexContext.CommandStart).pos;
        const clause = this.makeCompoundList(this.list());
        this.skipSemi();
        if (!this.accept(Token.Then, LexContext.CommandStart))
            this.error("expected 'then'", this.tok.getPos());
        const then_ = this.makeCompoundList(this.list());
        this.skipSemi();
        let else_;
        let end;
        if (this.tok.peek(LexContext.CommandStart).token === Token.Elif) {
            else_ = this.ifClause();
            end = else_.end; // elif's ifClause already consumed fi
        }
        else if (this.accept(Token.Else, LexContext.CommandStart)) {
            else_ = this.makeCompoundList(this.list());
            this.skipSemi();
            const closeEnd = this.acceptEnd(Token.Fi, LexContext.CommandStart);
            if (closeEnd < 0)
                this.error("expected 'fi' to close 'if'", this.tok.getPos());
            end = closeEnd >= 0 ? closeEnd : pos;
        }
        else {
            const closeEnd = this.acceptEnd(Token.Fi, LexContext.CommandStart);
            if (closeEnd < 0)
                this.error("expected 'fi' to close 'if'", this.tok.getPos());
            end = closeEnd >= 0 ? closeEnd : pos;
        }
        this._redirects = this.collectTrailingRedirects();
        return { type: "If", pos, end, clause, then: then_, else: else_ };
    }
    // for_clause := FOR word [IN word* (';'|NL)] DO list DONE
    //            | FOR '((' expr '))' [';'|NL] DO list DONE
    forClause() {
        const pos = this.tok.next(LexContext.CommandStart).pos;
        if (this.tok.peek(LexContext.Normal).token === Token.LParen) {
            return this.cStyleFor(pos);
        }
        const name = this.readWord(LexContext.Normal);
        const wordlist = [];
        this.skipNewlines(LexContext.CommandStart);
        if (this.tok.peek(LexContext.CommandStart).token === Token.In) {
            this.tok.next(LexContext.CommandStart);
            while (this.tok.peek(LexContext.Normal).token === Token.Word) {
                wordlist.push(this.readWord(LexContext.Normal));
            }
        }
        this.skipSemi();
        this.skipNewlines(LexContext.CommandStart);
        if (!this.accept(Token.Do, LexContext.CommandStart))
            this.error("expected 'do'", this.tok.getPos());
        const body = this.list();
        this.skipSemi();
        const closeEnd = this.acceptEnd(Token.Done, LexContext.CommandStart);
        if (closeEnd < 0)
            this.error("expected 'done' to close 'for'", this.tok.getPos());
        const end = closeEnd >= 0 ? closeEnd : pos;
        this._redirects = this.collectTrailingRedirects();
        return { type: "For", pos, end, name, wordlist, body: this.makeCompoundList(body) };
    }
    // C-style for: (( expr; expr; expr )) [;|NL] do list done | { list }
    cStyleFor(pos) {
        const [initStr, testStr, updateStr, initPos, testPos, updatePos] = this.tok.readCStyleForExprs();
        if (this.tok.peek(LexContext.CommandStart).token === Token.Semi)
            this.tok.next(LexContext.CommandStart);
        this.skipNewlines(LexContext.CommandStart);
        if (this.tok.peek(LexContext.CommandStart).token === Token.LBrace) {
            const bg = this.braceGroup();
            return new ArithmeticForImpl(pos, bg.end, bg.body, initStr, testStr, updateStr, initPos, testPos, updatePos);
        }
        if (!this.accept(Token.Do, LexContext.CommandStart))
            this.error("expected 'do'", this.tok.getPos());
        const body = this.list();
        const closeEnd = this.acceptEnd(Token.Done, LexContext.CommandStart);
        if (closeEnd < 0)
            this.error("expected 'done' to close 'for'", this.tok.getPos());
        const end = closeEnd >= 0 ? closeEnd : pos;
        this._redirects = this.collectTrailingRedirects();
        return new ArithmeticForImpl(pos, end, this.makeCompoundList(body), initStr, testStr, updateStr, initPos, testPos, updatePos);
    }
    whileClause() {
        return this.whileOrUntil("while");
    }
    untilClause() {
        return this.whileOrUntil("until");
    }
    whileOrUntil(kind) {
        const pos = this.tok.next(LexContext.CommandStart).pos;
        const clause = this.makeCompoundList(this.list());
        this.skipSemi();
        if (!this.accept(Token.Do, LexContext.CommandStart))
            this.error("expected 'do'", this.tok.getPos());
        const body = this.list();
        this.skipSemi();
        const closeEnd = this.acceptEnd(Token.Done, LexContext.CommandStart);
        if (closeEnd < 0)
            this.error(`expected 'done' to close '${kind}'`, this.tok.getPos());
        const end = closeEnd >= 0 ? closeEnd : pos;
        this._redirects = this.collectTrailingRedirects();
        return { type: "While", pos, end, kind, clause, body: this.makeCompoundList(body) };
    }
    // case_clause := CASE word IN (pattern) list (;; | ;& | ;;&) ... ESAC
    caseClause() {
        const pos = this.tok.next(LexContext.CommandStart).pos;
        const word = this.readWord(LexContext.Normal);
        this.skipNewlines(LexContext.CommandStart);
        if (!this.accept(Token.In, LexContext.CommandStart))
            this.error("expected 'in' after 'case' word", this.tok.getPos());
        this.skipNewlines(LexContext.CommandStart);
        const items = [];
        let t = this.tok.peek(LexContext.CommandStart).token;
        while (t !== Token.Esac && t !== Token.EOF) {
            const itemPos = this.tok.peek(LexContext.Normal).pos;
            this.accept(Token.LParen, LexContext.Normal);
            const pattern = [];
            t = this.tok.peek(LexContext.Normal).token;
            while (t !== Token.RParen && t !== Token.EOF) {
                if (t !== Token.Pipe)
                    pattern.push(this.toWord(this.tok.next(LexContext.Normal)));
                else
                    this.tok.next(LexContext.Normal);
                t = this.tok.peek(LexContext.Normal).token;
            }
            const rparenEnd = this.acceptEnd(Token.RParen, LexContext.Normal);
            const cmds = this.list();
            let itemEnd = rparenEnd >= 0 ? rparenEnd : itemPos;
            if (cmds.length > 0)
                itemEnd = cmds[cmds.length - 1].end;
            const item = {
                type: "CaseItem",
                pos: itemPos,
                end: itemEnd,
                pattern,
                body: this.makeCompoundList(cmds),
                terminator: undefined,
            };
            t = this.tok.peek(LexContext.CommandStart).token;
            if (t === Token.DoubleSemi || t === Token.SemiAmp || t === Token.DoubleSemiAmp) {
                const termTok = this.tok.next(LexContext.CommandStart);
                item.terminator = CASE_TERMINATORS[termTok.token];
                item.end = termTok.end;
            }
            items.push(item);
            this.skipNewlines(LexContext.CommandStart);
            t = this.tok.peek(LexContext.CommandStart).token;
        }
        const closeEnd = this.acceptEnd(Token.Esac, LexContext.CommandStart);
        if (closeEnd < 0)
            this.error("expected 'esac' to close 'case'", this.tok.getPos());
        const end = closeEnd >= 0 ? closeEnd : pos;
        this._redirects = this.collectTrailingRedirects();
        return { type: "Case", pos, end, word, items };
    }
    // select_clause := SELECT word [IN word* (';'|NL)] DO list DONE
    selectClause() {
        const pos = this.tok.next(LexContext.CommandStart).pos;
        const name = this.readWord(LexContext.Normal);
        const wordlist = [];
        this.skipNewlines(LexContext.CommandStart);
        if (this.tok.peek(LexContext.CommandStart).token === Token.In) {
            this.tok.next(LexContext.CommandStart);
            while (this.tok.peek(LexContext.Normal).token === Token.Word) {
                wordlist.push(this.readWord(LexContext.Normal));
            }
        }
        this.skipSemi();
        this.skipNewlines(LexContext.CommandStart);
        if (!this.accept(Token.Do, LexContext.CommandStart))
            this.error("expected 'do'", this.tok.getPos());
        const body = this.list();
        this.skipSemi();
        const closeEnd = this.acceptEnd(Token.Done, LexContext.CommandStart);
        if (closeEnd < 0)
            this.error("expected 'done' to close 'select'", this.tok.getPos());
        const end = closeEnd >= 0 ? closeEnd : pos;
        this._redirects = this.collectTrailingRedirects();
        return { type: "Select", pos, end, name, wordlist, body: this.makeCompoundList(body) };
    }
    // test_command := [[ test_expr ]]
    testCommand() {
        const pos = this.tok.next(LexContext.CommandStart).pos; // consume [[
        const expr = this.parseTestOr();
        const closeEnd = this.acceptEnd(Token.DblRBracket, LexContext.TestMode);
        if (closeEnd < 0 && this.tok.peek(LexContext.Normal).token === Token.EOF)
            this.error("expected ']]' to close '[['", this.tok.getPos());
        const end = closeEnd >= 0 ? closeEnd : pos;
        this._redirects = this.collectTrailingRedirects();
        return { type: "TestCommand", pos, end, expression: expr };
    }
    // test_or := test_and ('||' test_and)*
    parseTestOr() {
        let left = this.parseTestAnd();
        while (this.tok.peek(LexContext.TestMode).token === Token.Or) {
            this.tok.next(LexContext.TestMode);
            const right = this.parseTestAnd();
            left = {
                type: "TestLogical",
                pos: left.pos,
                end: right.end,
                operator: "||",
                left,
                right,
            };
        }
        return left;
    }
    // test_and := test_not ('&&' test_not)*
    parseTestAnd() {
        let left = this.parseTestNot();
        while (this.tok.peek(LexContext.TestMode).token === Token.And) {
            this.tok.next(LexContext.TestMode);
            const right = this.parseTestNot();
            left = {
                type: "TestLogical",
                pos: left.pos,
                end: right.end,
                operator: "&&",
                left,
                right,
            };
        }
        return left;
    }
    // test_not := '!' test_not | test_primary
    parseTestNot() {
        if (this.tok.peek(LexContext.TestMode).token === Token.Word && this.tok.peek(LexContext.TestMode).value === "!") {
            const notPos = this.tok.next(LexContext.TestMode).pos;
            const operand = this.parseTestNot();
            return { type: "TestNot", pos: notPos, end: operand.end, operand };
        }
        return this.parseTestPrimary();
    }
    // test_primary := '(' test_or ')' | unary_op word | word binary_op word | word
    parseTestPrimary() {
        // Grouped: ( expr )
        if (this.tok.peek(LexContext.TestMode).token === Token.LParen) {
            const openPos = this.tok.next(LexContext.TestMode).pos;
            const expr = this.parseTestOr();
            const closeEnd = this.acceptEnd(Token.RParen, LexContext.TestMode);
            if (closeEnd < 0)
                this.error("expected ')' to close test group", this.tok.getPos());
            const end = closeEnd >= 0 ? closeEnd : openPos;
            return { type: "TestGroup", pos: openPos, end, expression: expr };
        }
        const first = this.tok.next(LexContext.TestMode);
        const val = first.value;
        const firstPos = first.pos;
        const firstEnd = first.end;
        // Unary test: -op word
        if (UNARY_TEST_OPS[val] === 1) {
            const nt = this.tok.peek(LexContext.TestMode).token;
            if (nt === Token.Word) {
                const operand = this.readWord(LexContext.TestMode);
                return {
                    type: "TestUnary",
                    pos: firstPos,
                    end: operand.end,
                    operator: val,
                    operand,
                };
            }
        }
        // Check for binary op
        const nt = this.tok.peek(LexContext.TestMode);
        if (nt.token === Token.Word && BINARY_TEST_OPS[nt.value] === 1) {
            const op = this.tok.next(LexContext.TestMode).value;
            let right;
            if (op === "=~") {
                right = this.toWord(this.tok.readTestRegexWord());
            }
            else {
                right = this.readWord(LexContext.TestMode);
            }
            const left = this.toWordFromPosEnd(first, firstPos, firstEnd);
            return {
                type: "TestBinary",
                pos: firstPos,
                end: right.end,
                operator: op,
                left,
                right,
            };
        }
        // Standalone word (implicit -n test)
        const w = this.toWordFromPosEnd(first, firstPos, firstEnd);
        return { type: "TestUnary", pos: firstPos, end: w.end, operator: "-n", operand: w };
    }
    // function_def with 'function' keyword
    functionDef() {
        const pos = this.tok.next(LexContext.CommandStart).pos;
        const name = this.readWord(LexContext.Normal);
        if (this.tok.peek(LexContext.CommandStart).token === Token.LParen) {
            this.tok.next(LexContext.CommandStart);
            if (!this.accept(Token.RParen, LexContext.CommandStart))
                this.error("expected ')' after '('", this.tok.getPos());
        }
        this.skipNewlines(LexContext.CommandStart);
        const body = this.commandAsBody();
        const redirects = this._redirects;
        this._redirects = [];
        const end = redirects.length > 0 ? redirects[redirects.length - 1].end : body.end;
        return { type: "Function", pos, end, name, body, redirects };
    }
    // simple_command or function_def (word '(' ')' body)
    simpleCommandOrFunction() {
        const prefix = [];
        let redirects = [];
        let cmdPos = this.tok.peek(LexContext.CommandStart).pos;
        let lastEnd = cmdPos;
        while (this.tok.peek(LexContext.CommandStart).token === Token.Assignment) {
            const t = this.tok.next(LexContext.CommandStart);
            lastEnd = t.end;
            prefix.push(this.parseAssignment(t));
        }
        // Consume prefix redirects (e.g. "2>/dev/null cmd")
        while (this.tok.peek(LexContext.CommandStart).token === Token.Redirect) {
            redirects = this.collectRedirect(redirects, LexContext.CommandStart);
            lastEnd = redirects[redirects.length - 1].end;
        }
        if (this.tok.peek(LexContext.Normal).token !== Token.Word) {
            if (prefix.length > 0) {
                return {
                    type: "Command",
                    pos: cmdPos,
                    end: lastEnd,
                    name: undefined,
                    prefix,
                    suffix: EMPTY_SUFFIX,
                    redirects,
                };
            }
            return {
                type: "Command",
                pos: cmdPos,
                end: lastEnd,
                name: undefined,
                prefix: EMPTY_PREFIX,
                suffix: EMPTY_SUFFIX,
                redirects: EMPTY_REDIRECTS,
            };
        }
        const name = this.readWord(LexContext.Normal);
        lastEnd = name.end;
        // Check for function definition: word '(' ')' body
        if (this.tok.peek(LexContext.Normal).token === Token.LParen) {
            this.tok.next(LexContext.Normal);
            if (this.tok.peek(LexContext.Normal).token === Token.RParen) {
                this.tok.next(LexContext.Normal);
                this.skipNewlines(LexContext.CommandStart);
                const body = this.commandAsBody();
                const bodyRedirects = this._redirects;
                this._redirects = [];
                const end = bodyRedirects.length > 0 ? bodyRedirects[bodyRedirects.length - 1].end : body.end;
                return { type: "Function", pos: name.pos, end, name, body, redirects: bodyRedirects };
            }
        }
        const suffix = [];
        // Collect suffix words and redirects
        for (;;) {
            const st = this.tok.peek(LexContext.Normal).token;
            if (st === Token.Word || st === Token.Assignment) {
                const w = this.readWord(LexContext.Normal);
                suffix.push(w);
                lastEnd = w.end;
            }
            else if (st === Token.Redirect) {
                redirects = this.collectRedirect(redirects, LexContext.Normal);
                lastEnd = redirects[redirects.length - 1].end;
            }
            else {
                break;
            }
        }
        return { type: "Command", pos: cmdPos, end: lastEnd, name, prefix, suffix, redirects };
    }
    collectRedirect(redirects, ctx) {
        const t = this.tok.next(ctx);
        const tPos = t.pos;
        const tEnd = t.end;
        const r = {
            pos: tPos,
            end: tEnd,
            operator: REDIRECT_OPS[t.value] ?? ">",
            target: undefined,
            fileDescriptor: t.fileDescriptor,
            variableName: t.variableName,
            content: t.content,
            heredocQuoted: undefined,
            body: undefined,
        };
        if (t.content != null) {
            r.target = new WordImpl(t.content, t.targetPos, t.targetEnd, this.source);
        }
        if (t.value === "<<" || t.value === "<<-")
            this.tok.registerHereDocTarget(r);
        redirects.push(r);
        return redirects;
    }
    commandAsBody() {
        const t = this.tok.peek(LexContext.CommandStart).token;
        if (t === Token.LBrace)
            return this.braceGroup();
        if (t === Token.LParen)
            return this.subshell();
        const cmd = this.command();
        const p = this.tok.getPos();
        return cmd ?? { type: "CompoundList", pos: p, end: p, commands: [] };
    }
    readWord(ctx) {
        return this.toWord(this.tok.next(ctx));
    }
    toWord(tok) {
        return new WordImpl(this.source.slice(tok.pos, tok.end), tok.pos, tok.end, this.source);
    }
    toWordFromPosEnd(tok, pos, end) {
        return new WordImpl(this.source.slice(pos, end), pos, end, this.source);
    }
    parseAssignment(tok) {
        const text = this.source.slice(tok.pos, tok.end);
        const tokPos = tok.pos;
        const tokEnd = tok.end;
        const result = {
            type: "Assignment",
            pos: tokPos,
            end: tokEnd,
            text,
            name: undefined,
            value: undefined,
            append: undefined,
            index: undefined,
            array: undefined,
        };
        // Find the = sign, accounting for name, name[index], and += variants
        const eqIdx = text.indexOf("=");
        if (eqIdx <= 0)
            return result;
        let nameEnd = eqIdx;
        let append = false;
        let index;
        // Check for += (append)
        if (text.charCodeAt(eqIdx - 1) === 0x2b /* + */) {
            append = true;
            nameEnd = eqIdx - 1;
        }
        // Check for [index] before = or +=
        const bracketIdx = text.indexOf("[");
        if (bracketIdx > 0 && bracketIdx < nameEnd) {
            const rbracketIdx = text.indexOf("]", bracketIdx);
            if (rbracketIdx > bracketIdx && rbracketIdx + 1 === nameEnd) {
                index = text.slice(bracketIdx + 1, rbracketIdx);
                nameEnd = bracketIdx;
            }
        }
        const name = text.slice(0, nameEnd);
        result.name = name;
        if (append)
            result.append = true;
        if (index !== undefined)
            result.index = index;
        // Value portion starts after =
        const valStart = eqIdx + 1;
        const valText = text.slice(valStart);
        // Check for array assignment: value starts with (
        if (valText.charCodeAt(0) === 0x28 /* ( */ && valText.charCodeAt(valText.length - 1) === 0x29 /* ) */) {
            const inner = valText.slice(1, -1);
            const arrayOffset = tokPos + valStart + 1;
            const elements = this.parseArrayElements(inner, arrayOffset);
            result.array = elements;
        }
        else {
            result.value = new WordImpl(valText, tokPos + valStart, tokEnd, this.source);
        }
        return result;
    }
    parseArrayElements(inner, offset = 0) {
        const subTok = new Lexer(inner);
        const elements = [];
        while (subTok.peek(LexContext.Normal).token !== Token.EOF) {
            if (subTok.peek(LexContext.Normal).token === Token.Newline) {
                subTok.next(LexContext.Normal);
                continue;
            }
            const t = subTok.next(LexContext.Normal);
            if (t.token === Token.Word || t.token === Token.Assignment) {
                const pos = t.pos + offset;
                const end = t.end + offset;
                elements.push(new WordImpl(this.source.slice(pos, end), pos, end, this.source));
            }
        }
        return elements;
    }
    makeCompoundList(commands) {
        const p = this.tok.getPos();
        const pos = commands.length > 0 ? commands[0].pos : p;
        const end = commands.length > 0 ? commands[commands.length - 1].end : p;
        return { type: "CompoundList", pos, end, commands };
    }
}
